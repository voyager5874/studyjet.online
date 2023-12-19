import s from './spinner.module.scss'

export const Spinner = () => {
  return (
    <div className={s.page}>
      <div className={s.loader} />
    </div>
  )
}
