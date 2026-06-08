import {Laptop, LaptopMinimal, Monitor, Server} from "lucide-react";
import {capitalizeWords} from "../../../helper/helper.tsx";


interface assetCardProps {
    assetType : 'nb' | 'pc' | 'mws' | 'ws',
    value: number,
}


export const AssetCard = ({assetType = 'nb', value}: assetCardProps) => {

    const assetLabel = {
	nb : 'notebooks',
	pc :  'personal computers',
	mws : 'mobile workstations',
	ws : 'workstations'
    }

    const assetStyle = {
	nb: {
	    iconBg: 'bg-ptba-primary',
	    border: 'border-ptba-common/40',
	    cardBg: 'bg-ptba-common/10',
	    Icon: Laptop
	},
	ws: {
	    iconBg: 'bg-ptba-yellow',
	    border: 'border-ptba-yellow/40',
	    cardBg: 'bg-ptba-yellow/10',
	    Icon: Server
	},
	pc: {
	    iconBg: 'bg-ptba-green',
	    border: 'border-ptba-green/40',
	    cardBg: 'bg-ptba-green/10',
	    Icon: Monitor
	},
	mws: {
	    iconBg: 'bg-ptba-orange',
	    border: 'border-ptba-orange/40',
	    cardBg: 'bg-ptba-orange/10',
	    Icon: LaptopMinimal
	},

    }

    const {cardBg, border, iconBg, Icon} = assetStyle[assetType]
    const currentAssetLabel = assetLabel[assetType]

    return (
	<div className={`${cardBg} rounded-xl p-4 sm:p-6 border ${border} `}>
	    <div className={`w-10 h-10 sm:w-12 sm:h-12 ${iconBg} rounded-lg flex items-center justify-center mb-3 sm:mb-4`}>
		<Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
	    </div>
	    <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{value}</div>
	    <div className="text-xs sm:text-sm text-gray-600 font-medium">{capitalizeWords(currentAssetLabel)}</div>
	    {/*<div className="mt-2 text-xs text-green-600 font-medium">+12 this month</div>*/}
	</div>
    )
}