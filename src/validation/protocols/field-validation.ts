export interface FieldFalidation {
  field: string
  validate(value: string): Error
}
