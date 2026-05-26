/* eslint-disable @typescript-eslint/no-explicit-any */
// Type declarations for ApexCharts
declare module 'apexcharts' {
    export interface ApexChart {
        type?: 'line' | 'area' | 'bar' | 'radar' | 'histogram' | 'pie' | 'donut' | 'radialBar' | 'scatter' | 'bubble' | 'heatmap' | 'candlestick' | 'boxPlot' | 'rangeBar' | 'rangeArea' | 'treemap'
        height?: string | number
        width?: string | number
        background?: string
        foreColor?: string
        fontFamily?: string
        [key: string]: unknown
    }

    export interface ApexTooltip {
        formatter?: (val: any, opts?: any) => string
        [key: string]: unknown
    }

    export interface ApexOptions {
        chart?: ApexChart
        series?: unknown[]
        xaxis?: {
            categories?: unknown[]
            [key: string]: unknown
        }
        yaxis?: Record<string, unknown>
        plotOptions?: {
            pie?: {
                donut?: {
                    labels?: {
                        total?: {
                            label?: string
                            formatter?: () => string
                        }
                    }
                    size?: string
                }
            }
            [key: string]: unknown
        }
        dataLabels?: Record<string, unknown>
        fill?: Record<string, unknown>
        markers?: Record<string, unknown>
        colors?: string[]
        stroke?: Record<string, unknown>
        grid?: Record<string, unknown>
        legend?: Record<string, unknown>
        title?: Record<string, unknown>
        subtitle?: Record<string, unknown>
        tooltip?: ApexTooltip
        responsive?: unknown[]
        [key: string]: unknown
    }

    export default class ApexCharts {
        constructor(el: HTMLElement | string, options: ApexOptions)
        render(): Promise<void>
        updateOptions(options: ApexOptions, redrawPaths?: boolean, animate?: boolean): Promise<void>
        updateSeries(newSeries: unknown[], animate?: boolean): void
        destroy(): void
        [key: string]: unknown
    }
}
