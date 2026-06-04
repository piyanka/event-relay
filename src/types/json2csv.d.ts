declare module 'json2csv' {
  export type JSON2CSVField<TRecord extends object> =
    | keyof TRecord
    | {
        label: string;
        value: keyof TRecord | ((record: TRecord) => unknown);
      };

  export interface JSON2CSVParserOptions<TRecord extends object> {
    fields: Array<JSON2CSVField<TRecord>>;
  }

  export class Parser<TRecord extends object> {
    constructor(options: JSON2CSVParserOptions<TRecord>);
    parse(data: TRecord[]): string;
  }
}
