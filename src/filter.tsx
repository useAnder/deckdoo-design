import {
  forwardRef,
  useMemo,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { Button, CloseButton, Popover, TextInput, UnstyledButton } from "@mantine/core";
import { CaretDown, Check, MagnifyingGlass } from "@phosphor-icons/react";

/*
 * Os filtros em linha: a barra (`FilterBar`), o chip (`FilterChip`) e o chip que abre as escolhas
 * (`FilterMenu`). Vieram do `@eloquent-core/design`. O visual está em `design.css`. Filtro é
 * sempre em linha, nunca um formulário de filtros.
 */

/** A linha dos filtros: os chips à esquerda, `end` (a contagem, a ordem) à direita. */
export function FilterBar({ children, end }: { children: ReactNode; end?: ReactNode }) {
  return (
    <div className="dd-filterbar">
      <div className="dd-filterbar-main">{children}</div>
      {end && <div className="dd-filterbar-end">{end}</div>}
    </div>
  );
}

export type FilterChipProps = {
  label: ReactNode;
  /** O valor aplicado. Sem ele, o chip é o botão tracejado que abre o filtro. */
  value?: ReactNode;
  /** O ×, que tira o filtro (só com `value`). */
  onRemove?: () => void;
  /** O nome do × para leitor de tela. Padrão: `"Tirar o filtro"`. */
  removeLabel?: string;
} & Omit<ComponentPropsWithoutRef<"button">, "value" | "color">;

/**
 * O filtro aplicado ou a aplicar: rótulo, valor e o ×. Sem valor, é o botão que abre o filtro.
 * A ref e o resto das props (`onClick`, `aria-*`) vão para o botão principal, então serve de
 * `Menu.Target` e `Popover.Target` do Mantine; o × não dispara o `onClick` do chip. `disabled`
 * mostra o filtro travado (o valor fica, o × some, o clique não abre).
 */
export const FilterChip = forwardRef<HTMLButtonElement, FilterChipProps>(function FilterChip(
  { label, value, onRemove, removeLabel = "Tirar o filtro", className, disabled, ...rest },
  ref,
) {
  return (
    <span
      className="dd-chip"
      data-set={value !== undefined || undefined}
      data-disabled={disabled || undefined}
    >
      <UnstyledButton
        ref={ref}
        className={className ? `dd-chip-main ${className}` : "dd-chip-main"}
        disabled={disabled}
        {...rest}
      >
        <span className="dd-chip-label">{label}</span>
        {value !== undefined ? (
          <span className="dd-chip-value">{value}</span>
        ) : (
          <CaretDown size={12} />
        )}
      </UnstyledButton>
      {value !== undefined && onRemove && !disabled && (
        <CloseButton
          size="xs"
          onClick={(event) => {
            event.stopPropagation();
            onRemove();
          }}
          aria-label={removeLabel}
        />
      )}
    </span>
  );
});

/** Uma escolha da lista. `group` põe a opção debaixo de um título (os grupos na ordem em que aparecem). */
export type FilterOption = { value: string; label: string; group?: string };
/** O período, em datas ISO (`AAAA-MM-DD`); `null` é o lado aberto. */
export type FilterPeriod = { from: string | null; to: string | null };
export type PeriodShortcut = { label: string; value: FilterPeriod };

/** Os textos do `FilterMenu`, em pt-BR por padrão. */
export interface FilterMenuLabels {
  search: string;
  empty: string;
  clear: string;
  remove: string;
  from: string;
  to: string;
  textInput: string;
  /** O valor do chip com mais de uma escolha. */
  chosen: (count: number) => string;
  /** O valor do chip no período. Padrão: `periodLabel`, em pt-BR. */
  period: (value: FilterPeriod) => string | undefined;
}

const FILTER_LABELS: FilterMenuLabels = {
  search: "Buscar",
  empty: "Nada encontrado",
  clear: "Limpar",
  remove: "Tirar o filtro",
  from: "De",
  to: "Até",
  textInput: "Texto do filtro",
  chosen: (count) => `${count} escolhidos`,
  period: (value) => periodLabel(value),
};

/** O que vale para os quatro tipos: `onClose` avisa que o menu fechou; `disabled` trava o chip. */
type FilterMenuCommon = {
  label: ReactNode;
  onClose?: () => void;
  disabled?: boolean;
  labels?: Partial<FilterMenuLabels>;
};

export type FilterMenuProps = FilterMenuCommon &
  (
    | {
        kind: "single";
        options: FilterOption[];
        value: string | null;
        onChange: (value: string | null) => void;
        searchable?: boolean;
      }
    | {
        kind: "multi";
        options: FilterOption[];
        value: string[];
        onChange: (value: string[]) => void;
        searchable?: boolean;
      }
    | {
        kind: "period";
        value: FilterPeriod;
        onChange: (value: FilterPeriod) => void;
        /** Troca os atalhos do padrão (`periodShortcuts()`); `[]` tira os atalhos. */
        shortcuts?: PeriodShortcut[];
      }
    | { kind: "text"; value: string; onChange: (value: string) => void; placeholder?: string }
  );

/** Mais opções que isto e a lista ganha a busca (quando `searchable` não vem). */
const SEARCH_ABOVE = 8;

/* ——— datas ——— */

const ISO = /^(\d{4})-(\d{2})-(\d{2})$/;

const pad = (n: number) => String(n).padStart(2, "0");
const iso = (year: number, month: number, day: number) => `${year}-${pad(month)}-${pad(day)}`;
/** Último dia do mês (`month` de 1 a 12). */
const lastDay = (year: number, month: number) => new Date(Date.UTC(year, month, 0)).getUTCDate();

function parse(value: string | null): { y: number; m: number; d: number } | null {
  const match = value ? ISO.exec(value) : null;
  return match ? { y: Number(match[1]), m: Number(match[2]), d: Number(match[3]) } : null;
}

const MONTH = new Intl.DateTimeFormat("pt-BR", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

/**
 * O texto do período no chip, ou `undefined` sem filtro. O mês inteiro vira "out. 2026", o ano
 * inteiro "2026"; o resto é "01/10 – 15/10/2026" (o ano de cada ponta quando mudam) e, com um
 * lado só, "desde …" ou "até …". O que não for data ISO conta como vazio. Em pt-BR; outro
 * idioma passa o próprio texto em `labels.period` do `FilterMenu`.
 */
export function periodLabel(value: FilterPeriod): string | undefined {
  const from = parse(value.from);
  const to = parse(value.to);
  const full = (p: { y: number; m: number; d: number }) => `${pad(p.d)}/${pad(p.m)}/${p.y}`;
  if (from && to) {
    if (from.y === to.y && from.m === to.m && from.d === 1 && to.d === lastDay(to.y, to.m)) {
      // O Intl devolve "out. de 2026"; sem o "de".
      return MONTH.format(new Date(Date.UTC(from.y, from.m - 1, 1))).replace(" de ", " ");
    }
    if (from.y === to.y && from.m === 1 && from.d === 1 && to.m === 12 && to.d === 31)
      return String(from.y);
    const start = from.y === to.y ? `${pad(from.d)}/${pad(from.m)}` : full(from);
    return `${start} – ${full(to)}`;
  }
  if (from) return `desde ${full(from)}`;
  if (to) return `até ${full(to)}`;
  return undefined;
}

/** O mês inteiro (`month` de 1 a 12). */
export const monthPeriod = (year: number, month: number): FilterPeriod => ({
  from: iso(year, month, 1),
  to: iso(year, month, lastDay(year, month)),
});

/** O ano inteiro. */
export const yearPeriod = (year: number): FilterPeriod => ({
  from: iso(year, 1, 1),
  to: iso(year, 12, 31),
});

/**
 * Os atalhos do padrão, pela data local de hoje: este mês, o mês passado e este ano. Para
 * acrescentar um: `shortcuts={[...periodShortcuts(), { label: "Ano anterior", value: yearPeriod(ano - 1) }]}`.
 * `names` traduz os três rótulos.
 */
export function periodShortcuts(
  today = new Date(),
  names: { thisMonth: string; lastMonth: string; thisYear: string } = {
    thisMonth: "Este mês",
    lastMonth: "Mês passado",
    thisYear: "Este ano",
  },
): PeriodShortcut[] {
  const y = today.getFullYear();
  const m = today.getMonth() + 1;
  return [
    { label: names.thisMonth, value: monthPeriod(y, m) },
    { label: names.lastMonth, value: m === 1 ? monthPeriod(y - 1, 12) : monthPeriod(y, m - 1) },
    { label: names.thisYear, value: yearPeriod(y) },
  ];
}

/* ——— lista ——— */

const fold = (text: string) => text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function OptionList({
  options,
  searchable,
  multi,
  selected,
  onPick,
  text,
}: {
  options: FilterOption[];
  searchable: boolean;
  multi: boolean;
  selected: string[];
  onPick: (value: string) => void;
  text: FilterMenuLabels;
}) {
  const [query, setQuery] = useState("");
  // A busca acha pelo nome e pelo grupo; os grupos saem na ordem em que aparecem, os sem grupo antes.
  const groups = useMemo(() => {
    const q = fold(query.trim());
    const shown = q
      ? options.filter((o) => fold(o.label).includes(q) || fold(o.group ?? "").includes(q))
      : options;
    const byGroup = new Map<string, FilterOption[]>([["", []]]);
    for (const option of shown) {
      const key = option.group ?? "";
      byGroup.set(key, [...(byGroup.get(key) ?? []), option]);
    }
    return [...byGroup].filter(([, list]) => list.length > 0);
  }, [options, query]);

  const renderOption = (option: FilterOption) => {
    const on = selected.includes(option.value);
    return (
      <UnstyledButton
        key={option.value}
        className="dd-filter-menu-option"
        role="option"
        aria-selected={on}
        data-selected={on || undefined}
        onClick={() => onPick(option.value)}
      >
        {multi && (
          <span className="dd-filter-menu-box" aria-hidden>
            {on && <Check size={10} weight="bold" />}
          </span>
        )}
        <span className="dd-filter-menu-text">{option.label}</span>
        {!multi && on && <Check size={14} weight="bold" className="dd-filter-menu-check" />}
      </UnstyledButton>
    );
  };

  return (
    <>
      {searchable && (
        <TextInput
          size="xs"
          className="dd-filter-menu-search"
          placeholder={text.search}
          aria-label={text.search}
          data-autofocus
          leftSection={<MagnifyingGlass size={14} />}
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
        />
      )}
      <div className="dd-filter-menu-list" role="listbox" aria-multiselectable={multi || undefined}>
        {groups.map(([group, list]) =>
          group === "" ? (
            list.map(renderOption)
          ) : (
            <div key={group} role="group" aria-label={group} className="dd-filter-menu-group">
              <div className="dd-eyebrow dd-filter-menu-group-title" aria-hidden>
                {group}
              </div>
              {list.map(renderOption)}
            </div>
          ),
        )}
        {groups.length === 0 && <div className="dd-filter-menu-empty">{text.empty}</div>}
      </div>
    </>
  );
}

function PeriodForm({
  value,
  shortcuts,
  onChange,
  text,
}: {
  value: FilterPeriod;
  shortcuts: PeriodShortcut[];
  onChange: (value: FilterPeriod) => void;
  text: FilterMenuLabels;
}) {
  const set = (side: "from" | "to") => (event: { currentTarget: { value: string } }) =>
    onChange({ ...value, [side]: event.currentTarget.value || null });
  return (
    <div className="dd-filter-menu-period">
      <div className="dd-filter-menu-dates">
        <TextInput
          size="xs"
          type="date"
          label={text.from}
          value={value.from ?? ""}
          max={value.to ?? undefined}
          onChange={set("from")}
        />
        <TextInput
          size="xs"
          type="date"
          label={text.to}
          value={value.to ?? ""}
          min={value.from ?? undefined}
          onChange={set("to")}
        />
      </div>
      {shortcuts.length > 0 && (
        <div className="dd-filter-menu-shortcuts">
          {shortcuts.map((shortcut) => (
            <Button
              key={shortcut.label}
              size="compact-xs"
              variant="default"
              onClick={() => onChange(shortcut.value)}
            >
              {shortcut.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

function TextForm({
  value,
  placeholder,
  onApply,
  text,
}: {
  value: string;
  placeholder?: string;
  onApply: (value: string) => void;
  text: FilterMenuLabels;
}) {
  const [draft, setDraft] = useState(value);
  return (
    <div className="dd-filter-menu-text-form">
      <TextInput
        size="xs"
        data-autofocus
        aria-label={text.textInput}
        placeholder={placeholder}
        value={draft}
        onChange={(event) => setDraft(event.currentTarget.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            onApply(draft.trim());
          }
        }}
      />
    </div>
  );
}

/* ——— a peça ——— */

/**
 * O filtro com escolhas, o chip e o menu num só, controlado (`value`/`onChange`): `single` (uma,
 * fecha ao escolher), `multi` (várias, fica aberto; "Limpar" embaixo), `period` (de–até com os
 * atalhos, os do padrão ou `shortcuts`) e `text` (Enter aplica e fecha). As listas ganham a
 * busca quando passam de 8 opções, a menos que `searchable` diga o contrário, e os títulos de
 * grupo pelo `group` das opções. O valor do chip é escrito pela peça; o × limpa. `onClose` avisa
 * que o menu fechou (descarte ali o período digitado pela metade); `disabled` mostra o chip
 * travado, sem abrir e sem o ×. Os textos estão em `labels`.
 */
export function FilterMenu(props: FilterMenuProps) {
  const [opened, setOpenedState] = useState(false);
  const { onClose, disabled } = props;
  const text = { ...FILTER_LABELS, ...props.labels };
  const setOpened = (next: boolean) => {
    if (next && disabled) return;
    if (!next && opened) onClose?.();
    setOpenedState(next);
  };
  const close = () => setOpened(false);

  let value: string | undefined;
  let onRemove: () => void;
  let body: ReactNode;

  switch (props.kind) {
    case "single": {
      const { options, onChange } = props;
      value =
        props.value === null
          ? undefined
          : (options.find((o) => o.value === props.value)?.label ?? props.value);
      onRemove = () => onChange(null);
      body = (
        <OptionList
          options={options}
          searchable={props.searchable ?? options.length > SEARCH_ABOVE}
          multi={false}
          selected={props.value === null ? [] : [props.value]}
          onPick={(picked) => {
            onChange(picked);
            close();
          }}
          text={text}
        />
      );
      break;
    }
    case "multi": {
      const { options, onChange } = props;
      const chosen = props.value;
      if (chosen.length === 1)
        value = options.find((o) => o.value === chosen[0])?.label ?? chosen[0];
      else if (chosen.length > 1) value = text.chosen(chosen.length);
      onRemove = () => onChange([]);
      body = (
        <>
          <OptionList
            options={options}
            searchable={props.searchable ?? options.length > SEARCH_ABOVE}
            multi
            selected={chosen}
            onPick={(picked) =>
              onChange(
                chosen.includes(picked) ? chosen.filter((v) => v !== picked) : [...chosen, picked],
              )
            }
            text={text}
          />
          {chosen.length > 0 && (
            <div className="dd-filter-menu-foot">
              <Button size="compact-xs" variant="subtle" color="gray" onClick={() => onChange([])}>
                {text.clear}
              </Button>
            </div>
          )}
        </>
      );
      break;
    }
    case "period": {
      const { onChange } = props;
      value = text.period(props.value);
      onRemove = () => onChange({ from: null, to: null });
      body = (
        <PeriodForm
          value={props.value}
          shortcuts={props.shortcuts ?? periodShortcuts()}
          onChange={onChange}
          text={text}
        />
      );
      break;
    }
    case "text": {
      const { onChange } = props;
      value = props.value.trim() === "" ? undefined : `“${props.value}”`;
      onRemove = () => onChange("");
      body = (
        <TextForm
          value={props.value}
          placeholder={props.placeholder}
          onApply={(applied) => {
            onChange(applied);
            close();
          }}
          text={text}
        />
      );
      break;
    }
  }

  return (
    <Popover
      opened={opened && !disabled}
      onChange={setOpened}
      position="bottom-start"
      offset={6}
      withinPortal
      shadow="md"
      trapFocus
      returnFocus
    >
      <Popover.Target>
        <FilterChip
          label={props.label}
          value={value}
          onRemove={onRemove}
          removeLabel={text.remove}
          disabled={disabled}
          aria-haspopup="dialog"
          aria-expanded={opened}
          onClick={() => setOpened(!opened)}
        />
      </Popover.Target>
      <Popover.Dropdown className="dd-filter-menu">{body}</Popover.Dropdown>
    </Popover>
  );
}
