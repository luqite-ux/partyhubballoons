export type MetricParts = {
  target: number;
  prefix: string;
  suffix: string;
  grouped: boolean;
};

export function parseMetric(value: string): MetricParts {
  const match = value.match(/^(.*?)([\d,]+)(.*)$/);
  if (!match) throw new Error(`Metric value has no number: ${value}`);
  return {
    target: Number(match[2].replaceAll(",", "")),
    prefix: match[1],
    suffix: match[3],
    grouped: match[2].includes(","),
  };
}

export function formatMetric(parts: MetricParts, current: number) {
  const rounded = Math.round(current);
  const number = parts.grouped ? rounded.toLocaleString("en-US") : String(rounded);
  return `${parts.prefix}${number}${parts.suffix}`;
}
