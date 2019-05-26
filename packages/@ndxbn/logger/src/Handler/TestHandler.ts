import { Context } from "../Context";
import HandlerInterface from "./HandlerInterface";

type Record = {
  message: string;
  context: Context;
}

/**
 * Used for testing purposes.
 *
 * It records all records and gives you access to them for verification.
 */
export default class TestHandler implements HandlerInterface {
  public records: Record[] = [];

  public async log(message: string, context?: Context): Promise<void> {
    this.records.push({ message, context });
  }

  public hasRecords(): boolean {
    return this.records.length !== 0;
  }

  public reset(): void {
    this.records = [];
  }


  public hasRecordThatContains(message: string): boolean {
    return this.hasRecordThatPasses(
      record => record.message.includes(message)
    );
  }

  public hasRecordThatMatches(regex: RegExp): boolean {
    return this.hasRecordThatPasses(
      record => regex.test(record.message)
    );
  }

  public hasRecordThatPasses(predicate: (record: Record) => boolean): boolean {
    return this.records.find(predicate) != undefined;
  }
}
