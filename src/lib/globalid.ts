export class GlobalID {
  private static kStartTime = new Date(1104537600000)
  private sequence_count_ = 0n
  private start_time_seconds_ = 0n
  private start_time_date_ = GlobalID.kStartTime
  private process_id_ = 0n
  private box_id_ = 0n
  constructor(num: number | bigint) {
    num = BigInt(num)
    this.sequence_count_ = num & 0xfffffn
    this.start_time_seconds_ = (num >> 20n) & 0x3fffffffn
    this.process_id_ = (num >> 50n) & 0xfn
    this.box_id_ = (num >> 54n) & 0x3ffn

    this.start_time_date_ = new Date(GlobalID.kStartTime.valueOf() + Number(this.start_time_seconds_) * 1000)
  }

  sequence_count() {
    return Number(this.sequence_count_)
  }
  start_time_seconds() {
    return Number(this.start_time_seconds_)
  }
  start_time() {
    return this.start_time_date_
  }
  process_id() {
    return Number(this.process_id_)
  }
  box_id() {
    return Number(this.box_id_)
  }
}
