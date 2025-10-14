const UTF8Decoder = new TextDecoder()
const UTF8Encoder = new TextEncoder()

function nextPowerOfTwoIncrementsOf2048(x: number): number {
  if (x <= 0) throw new Error('Input must be a positive number.')

  // Step 1: Find the next power of 2 greater than or equal to x
  let powerOfTwo = 1
  while (powerOfTwo < x) {
    powerOfTwo <<= 1 // Double the value by left shifting
  }

  // Step 2: Round this power of 2 up to the nearest multiple of 2048
  const increment = 2048
  const roundedUpToIncrement = Math.ceil(powerOfTwo / increment) * increment

  return roundedUpToIncrement
}

export class Buffer {
  private buffer: ArrayBuffer
  private view: DataView
  private growable: boolean
  private littleEndian: boolean = true

  private offset = 0

  public constructor(
    sizeOrArray: number | number[] | ArrayBuffer,
    littleEndian: boolean = true,
    growable: boolean = true,
  ) {
    this.growable = growable
    if (typeof sizeOrArray == 'number') {
      this.buffer = new Uint8Array(sizeOrArray).buffer
    } else if (sizeOrArray instanceof ArrayBuffer) {
      this.buffer = sizeOrArray
    } else {
      this.buffer = new Uint8Array(sizeOrArray).buffer
    }
    this.view = new DataView(this.buffer)
    this.littleEndian = littleEndian
  }

  public static from(array: number[] | ArrayBuffer, littleEndian: boolean = true, growable: boolean = true): Buffer {
    const tmp = new Buffer(array, littleEndian, growable)
    // tmp.seek(tmp.length);
    return tmp
  }

  public static alloc(size: number, littleEndian: boolean = true, growable: boolean = true): Buffer {
    return new Buffer(size, littleEndian, growable)
  }

  public get length(): number {
    return this.buffer.byteLength
  }

  public bytesWritten(): number {
    return this.offset
  }

  public bytesRead(): number {
    return this.offset
  }

  public bytesLeft(): number {
    return this.length - this.offset
  }

  public setGrowable(growable: boolean): boolean {
    return (this.growable = growable)
  }

  public getView(): DataView {
    return this.view
  }
  public getBuffer(): ArrayBuffer {
    return this.buffer
  }

  public grow(length: number): void {
    if (!this.growable) throw new Error("Tried to grow buffer but buffer isn't growable.")
    const tmpBuffer = this.buffer
    this.buffer = new ArrayBuffer(tmpBuffer.byteLength + nextPowerOfTwoIncrementsOf2048(length))
    new Uint8Array(this.buffer).set(new Uint8Array(tmpBuffer))
    this.view = new DataView(this.buffer)
    // tmpBuffer = null;
  }

  private validateSize(length: number): void {
    if (this.offset + length > this.length) {
      if (this.growable) {
        this.grow(this.offset + length - this.length + 1)
      } else {
        throw new RangeError('Buffer not large enough to write/read!')
      }
    }
  }

  public seek(seek: number): number {
    return (this.offset += seek)
  }

  public go(offset: number): number {
    return (this.offset = offset)
  }

  public readBytes(length: number = this.length - this.bytesRead()): Uint8Array {
    this.validateSize(length)
    const tmp = new Uint8Array(length)
    tmp.set(new Uint8Array(this.buffer.slice(this.offset, (this.offset += length))))
    return tmp
    // return Buffer.from(this.buffer.slice(this.offset, (this.offset += length)), this.littleEndian, false);
  }

  public writeBytes(bytes: ArrayBufferLike): void {
    const u8 = new Uint8Array(bytes)
    for (let i = 0; i < u8.length; i++) {
      this.writeUint8(u8[i])
    }
  }

  public writeUint8(value: number): number {
    this.validateSize(1)
    this.view.setUint8(this.offset++, value)
    return this.offset
  }

  public readUint8(): number {
    this.validateSize(1)
    return this.view.getUint8(this.offset++)
  }

  public writeInt8(value: number): number {
    this.validateSize(1)
    this.view.setInt8(this.offset++, value)
    return this.offset
  }

  public readInt8(): number {
    this.validateSize(1)
    return this.view.getInt8(this.offset++)
  }

  public writeUint16(value: number): number {
    this.validateSize(2)
    this.view.setUint16((this.offset += 2) - 2, value, this.littleEndian)
    return this.offset
  }

  public readUint16(): number {
    this.validateSize(2)
    return this.view.getUint16((this.offset += 2) - 2, this.littleEndian)
  }

  public writeInt16(value: number): number {
    this.validateSize(2)
    this.view.setInt16((this.offset += 2) - 2, value, this.littleEndian)
    return this.offset
  }

  public readInt16(): number {
    this.validateSize(2)
    return this.view.getInt16((this.offset += 2) - 2, this.littleEndian)
  }

  public writeUint32(value: number): number {
    this.validateSize(4)
    this.view.setUint32((this.offset += 4) - 4, value, this.littleEndian)
    return this.offset
  }

  public readUint32(): number {
    this.validateSize(4)
    return this.view.getUint32((this.offset += 4) - 4, this.littleEndian)
  }

  public writeBigUint64(value: bigint): number {
    this.validateSize(8)
    this.view.setBigUint64((this.offset += 8) - 8, value, this.littleEndian)
    return this.offset
  }

  public readUint64(): bigint {
    this.validateSize(8)
    return this.view.getBigUint64((this.offset += 8) - 8, this.littleEndian)
  }

  public writeBigInt64(value: bigint): number {
    this.validateSize(8)
    this.view.setBigInt64((this.offset += 8) - 8, value, this.littleEndian)
    return this.offset
  }

  public readInt64(): bigint {
    this.validateSize(8)
    return this.view.getBigInt64((this.offset += 8) - 8, this.littleEndian)
  }

  public writeInt32(value: number): number {
    this.validateSize(4)
    this.view.setInt32((this.offset += 4) - 4, value, this.littleEndian)
    return this.offset
  }

  public readInt32(): number {
    this.validateSize(4)
    return this.view.getInt32((this.offset += 4) - 4, this.littleEndian)
  }

  public writeFloat32(value: number): number {
    this.validateSize(4)
    this.view.setFloat32((this.offset += 4) - 4, value, this.littleEndian)
    return this.offset
  }

  public readFloat32(): number {
    this.validateSize(4)
    return this.view.getFloat32((this.offset += 4) - 4, this.littleEndian)
  }

  public writeFloat64(value: number): number {
    this.validateSize(8)
    this.view.setFloat64((this.offset += 8) - 8, value, this.littleEndian)
    return this.offset
  }

  public readFloat64(): number {
    this.validateSize(8)
    return this.view.getFloat64((this.offset += 8) - 8, this.littleEndian)
  }

  public readUTF8(): string {
    const bytes = []
    let pByte = 0
    while ((pByte = this.readUint8())) {
      bytes.push(pByte)
    }
    return UTF8Decoder.decode(new Uint8Array(bytes))
  }

  public writeUTF8(input: string): number {
    const encoded = UTF8Encoder.encode(input)
    this.validateSize(encoded.length + 1)
    for (const byte of encoded) {
      this.writeUint8(byte)
    }
    this.writeUint8(0)
    return this.offset
  }

  public readUTF16(): string {
    let string = ''
    let pByte = 0
    while ((pByte = this.readUint16())) {
      string += String.fromCharCode(pByte)
    }
    return string
  }

  public writeUTF16(input: string): number {
    this.validateSize(input.length * 2 + 2)
    for (let i = 0; i < input.length; i++) {
      this.writeUint16(input.charCodeAt(i))
    }
    this.writeUint16(0)
    return this.offset
  }

  public finish(trimmed: boolean = true): ArrayBuffer {
    if (trimmed) return this.buffer.slice(0, this.offset)
    else return this.buffer.slice(0, this.length)
  }
}
