import { Label, Pie, PieChart } from "recharts"
import { useMemo } from "react"

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

export interface DonutChartProps {
    data: {
	label: string
	value: number
	color: string
    }[]
    centerLabel?: string
}

export const ChartPieDonutText = ({ data, centerLabel = "Total" }: DonutChartProps) => {
    // Menghitung total untuk ditampilkan di tengah Donut
    const totalValue = useMemo(() => {
	return data.reduce((acc, curr) => acc + curr.value, 0)
    }, [data])

    const { chartConfig, chartData } = useMemo(() => {
	const config: Record<string, any> = {
	    value: { label: centerLabel },
	}

	const formattedData = data.map((item, index) => {
	    const key = item.label.toLowerCase().replace(/[^a-z0-9]/g, '_') + `_${index}`

	    config[key] = {
		label: item.label,
		color: item.color,
	    }
	    return {
		id: key,
		value: item.value,
		// Tambahan Fallback warna (Abu-abu jika item.color kosong)
		fill: item.color || "hsl(var(--muted))",
	    }
	})

	return { chartConfig: config, chartData: formattedData }
    }, [data, centerLabel])

    return (
	<div className="flex flex-col w-full max-w-sm mx-auto">
	    <ChartContainer
		config={chartConfig}
		className="mx-auto aspect-square max-h-[250px] w-full"
	    >
		<PieChart>
		    <ChartTooltip
			cursor={false}
			content={<ChartTooltipContent hideLabel />} // hideLabel biasanya lebih rapi untuk Pie/Donut
		    />
		    <Pie
			data={chartData}
			dataKey="value"
			nameKey="id"
			innerRadius={60} // Membuat lubang di tengah agar jadi Donut
			strokeWidth={5}  // Memberikan jarak antar potongan pai
		    >
			<Label
			    content={({ viewBox }) => {
				if (viewBox && "cx" in viewBox && "cy" in viewBox) {
				    return (
					<text
					    x={viewBox.cx}
					    y={viewBox.cy}
					    textAnchor="middle"
					    dominantBaseline="middle"
					>
					    <tspan
						x={viewBox.cx}
						y={viewBox.cy}
						className="fill-foreground text-3xl font-bold"
					    >
						{totalValue.toLocaleString()}
					    </tspan>
					    <tspan
						x={viewBox.cx}
						y={(viewBox.cy || 0) + 24}
						className="fill-muted-foreground text-sm"
					    >
						{centerLabel}
					    </tspan>
					</text>
				    )
				}
			    }}
			/>
		    </Pie>
		</PieChart>
	    </ChartContainer>

	    {/* Custom Legend yang sudah kamu buat */}
	    <div className="grid grid-cols-2 gap-3 px-4 pt-6 pb-2 w-full">
		{data.map((item, index) => (
		    <div key={index} className="flex items-center justify-between w-full">
			<div className="flex items-center gap-2">
			    <div
				className="h-3 w-3 shrink-0 rounded-sm"
				style={{ backgroundColor: item.color || "hsl(var(--muted))" }}
			    />
			    <span className="text-xs text-muted-foreground truncate max-w-[80px]">
                             {item.label.toUpperCase()}
                          </span>
			</div>
			<span className="text-xs font-semibold text-foreground">
                          {item.value.toLocaleString()}
                      </span>
		    </div>
		))}
	    </div>
	</div>
    )
}