import useTranslation from "@/utils/hooks/useTranslation"
import { useLocale } from "next-intl"
import { useMemo } from "react"
import { TColumnsTable } from "./type"

const useTranslationTable = <T, SR>(column: TColumnsTable<T, SR>): TColumnsTable<T, SR> => {
  const locale = useLocale()
  const t = useTranslation()

  const columnTranslation = useMemo(() => {
    return column.map((item) => ({ ...item, name: t(`${item?.name}`) }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, column])

  return columnTranslation
}

export default useTranslationTable