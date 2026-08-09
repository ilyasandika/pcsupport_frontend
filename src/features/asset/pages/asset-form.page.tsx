import {FormWrapper} from "@/components/form-wrapper.tsx";
import {
    Barcode,
    Boxes,
    Building2,
    Calendar,
    Cpu,
    HardDrive, Info,
    MemoryStick,
    PackageIcon,
    Server,
    Tag,
} from "lucide-react";
import {InputText} from "@/components/input-text.tsx";
import {useEffect, useState} from "react";
import {AssetRepository} from "@/data/repositories/asset.repository.ts";
import {useLoaderData, useParams} from "react-router";
import {
    AllowedStatusChange,
    AssetStatus,
    type AssetStatusType,
    type IAssetPayload,
    type IDetailAsset
} from "@/types/asset.type.ts";
import {InputSelect} from "@/components/input-select.tsx";
import type {IAssetCategory} from "@/types/asset-category.type.ts";
import {SeparatorWithLabel} from "@/components/separator-with-label.tsx";
import {useFormErrors} from "@/hooks/use-errors.tsx";
import {useNotificationDialog} from "@/context/NotificationDialogContext.tsx";
import type {IProject} from "@/types/project.type.ts";
import {InputCapacity} from "@/components/input-capacity.tsx";
import {useMutation} from "@tanstack/react-query";
import type {IErrorResponse} from "@/types/api.type.ts";
import {Card, CardContent} from "@/components/ui/card.tsx";
import {capitalizeWords} from "@/helper/helper.tsx";


export const AssetFormPage = () => {
    const {showNotification} = useNotificationDialog()
    const {asset, categories, projects}: {asset: IDetailAsset, categories: IAssetCategory[], projects: IProject[]} = useLoaderData()
    const {id} = useParams()
    const {setErrors, getFieldErrors} = useFormErrors()

    useEffect(() => {
	console.log(asset)
    }, [asset]);

    const categoryList = categories.map(category => ({
	label: category.name.toUpperCase(),
	value: category.id as unknown as string
    }))
    const projectList = projects.map(project => ({
	label: project.name,
	value: project.id as unknown as string
    }))

    const [serialNumberValue, setSerialNumberValue] = useState("")
    const [assetTag, setAssetTag] = useState("")
    const [hostname, setHostname] = useState("")
    const [brand, setBrand] = useState("")
    const [model, setModel] = useState("")
    const [processor, setProcessor] = useState("")
    const [storageType, setStorageType] = useState("")
    const [storageCapacityByte, setStorageCapacityByte] = useState<number>()
    const [memoryType, setMemoryType] = useState("")
    const [memoryCapacityByte, setMemoryCapacityByte] = useState<number>()
    const [warrantyDate, setWarrantyDate] = useState(new Date().toISOString().slice(0, 10))
    const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().slice(0, 10))
    const [categoryId, setCategoryId] = useState<number>(categories[0].id)
    const [projectId, setProjectId] = useState<number>(projects[0].id)
    const [status, setStatus] = useState<AssetStatusType>()
    const isUpdate = !!id

    useEffect(() => {
	if (asset) {
	    setSerialNumberValue(asset.serialNumber)
	    setAssetTag(asset.assetTag)
	    setHostname(asset.hostname)
	    setBrand(asset.brand)
	    setModel(asset.model ?? "")
	    setProcessor(asset.processor ?? "")
	    setStorageType(asset.storageType ?? "")
	    setStorageCapacityByte(asset.storageCapacityByte)
	    setMemoryType(asset.memoryType ?? "")
	    setMemoryCapacityByte(asset.memoryCapacityByte)
	    setWarrantyDate(asset.warrantyDate ? String(asset.warrantyDate).slice(0, 10) : "")
	    setPurchaseDate(asset.purchaseDate ? String(asset.purchaseDate).slice(0, 10) : "")
	    setCategoryId(asset.category.id)
	    setProjectId(asset.project.id)
	    setStatus(asset.status)
	}
    }, [asset])

    const { mutate, isPending } = useMutation({
	mutationFn: (payload: IAssetPayload) => {
	    return isUpdate
		? AssetRepository.updateAsset(payload)
		: AssetRepository.createAsset(payload);
	},
	onSuccess: () => {
	    const actionText = isUpdate ? "updated" : "created";
	    showNotification({
		variant: "success",
		title: `Asset has been ${actionText}`,
		description: `Asset has been ${actionText} successfully`,
		onClose: () => window.location.replace('/assets'),
	    });
	},
	onError: (err: IErrorResponse) => {
	    setErrors(err.errors);
	}
    });

    const handleSubmit =  () => {
	mutate({
	    serialNumber: serialNumberValue,
	    assetTag,
	    hostname,
	    brand,
	    model,
	    processor,
	    storageType,
	    storageCapacityByte: Number(storageCapacityByte),
	    memoryType,
	    memoryCapacityByte: Number(memoryCapacityByte),
	    warrantyDate,
	    purchaseDate,
	    categoryId: Number(categoryId),
	    projectId,
	    status,
	})
    }


    return (
	<FormWrapper
	    label={"Asset"}
	    variant={isUpdate ? "update" : "create"}
	    action={handleSubmit}
	    Icon={PackageIcon}
	    isLoading={isPending}
	    errors={getFieldErrors("general")}
	>
	    <div className="space-y-4">
		<div className="flex gap-4 ">
		    <Card className='w-3/4 '>
			<CardContent>
			    <SeparatorWithLabel label="Identification" className="mb-4" />
			    <div className="grid grid-cols-2 gap-4">
				<InputText
				    label="Asset Tag"
				    id="assetTag"
				    Icon={Tag}
				    value={assetTag}
				    disabled={isUpdate}
				    onChange={(e) => setAssetTag(e.target.value)}
				    errors={getFieldErrors("assetTag")}
				    required={true}
				/>
				<InputText
				    label="Serial Number"
				    id="serialNumber"
				    Icon={Barcode}
				    value={serialNumberValue}
				    onChange={(e) => setSerialNumberValue(e.target.value)}
				    errors={getFieldErrors("serialNumber")}
				    required={true}
				/>
				<InputSelect
				    value={categoryId as unknown as string}
				    items={categoryList}
				    onChange={value => setCategoryId(Number(value))}
				    Icon={Boxes}
				    label={"Category"}
				    errors={getFieldErrors("categoryId")}
				    required={true}
				/>
				<InputText
				    label="Hostname"
				    id="hostname"
				    Icon={Server}
				    value={hostname}
				    onChange={(e) => setHostname(e.target.value)}
				    errors={getFieldErrors("hostname")}
				    required={true}
				/>
				<InputText
				    label="Brand"
				    id="brand"
				    Icon={Building2}
				    value={brand}
				    placeholder={"HP"}
				    onChange={(e) => setBrand(e.target.value)}
				    errors={getFieldErrors("brand")}
				    required={true}
				/>
				<InputText
				    label="Model"
				    id="model"
				    Icon={PackageIcon}
				    value={model}
				    placeholder={"Elitebook 630 G10"}
				    onChange={(e) => setModel(e.target.value)}
				    errors={getFieldErrors("model")}
				    required={true}
				/>
			    </div>
			</CardContent>
		    </Card>
		    <Card className=' w-1/4'>
			<CardContent>
			    <SeparatorWithLabel label="Ownership & Warranty" className="mb-4" />
			    <div className="flex flex-col gap-4">
				<InputSelect
				    value={projectId as unknown as string}
				    items={projectList}
				    onChange={value => setProjectId(Number(value))}
				    Icon={Building2}
				    label={"Project"}
				    errors={getFieldErrors("projectId")}
				    required={true}
				/>
				<InputText
				    label="Purchase Date"
				    id="purchaseDate"
				    Icon={Calendar}
				    value={purchaseDate}
				    onChange={(e) => setPurchaseDate(e.target.value)}
				    type="date"
				    errors={getFieldErrors("purchaseDate")}
				/>
				<InputText
				    label="Warranty Date"
				    id="warrantyDate"
				    Icon={Calendar}
				    value={warrantyDate}
				    onChange={(e) => setWarrantyDate(e.target.value)}
				    type="date"
				    errors={getFieldErrors("warrantyDate")}
				/>
			    </div>
			</CardContent>
		    </Card>
		</div>
		<div className='flex-1'>
		   <Card>
		       <CardContent>
			   <SeparatorWithLabel label="Specification" className="mb-4"/>
			   <div className="grid grid-cols-3 gap-4">
			       <InputText
				   label="Processor"
				   id="processor"
				   Icon={Cpu}
				   value={processor}
				   onChange={(e) => setProcessor(e.target.value)}
				   errors={getFieldErrors("processor")}
			       />
			       <InputText
				   label="Storage Type"
				   id="storageType"
				   Icon={HardDrive}
				   value={storageType}
				   placeholder={"SSD"}
				   onChange={(e) => setStorageType(e.target.value)}
				   errors={getFieldErrors("storageType")}
			       />
			       <InputText
				   label="Memory Type"
				   id="memoryType"
				   Icon={MemoryStick}
				   value={memoryType}
				   placeholder={"DDR4"}
				   onChange={(e) => setMemoryType(e.target.value)}
				   errors={getFieldErrors("memoryType")}
			       />
			       <InputCapacity
				   label="Storage Capacity"
				   id="storageCapacityByte"
				   Icon={HardDrive}
				   value={storageCapacityByte}
				   onChange={setStorageCapacityByte}
				   errors={getFieldErrors("storageCapacityByte")}
			       />
			       <InputCapacity
				   label="Memory Capacity"
				   id="memoryCapacityByte"
				   Icon={MemoryStick}
				   value={memoryCapacityByte}
				   onChange={setMemoryCapacityByte}
				   errors={getFieldErrors("memoryCapacityByte")}
			       />
			   </div>
		       </CardContent>
		   </Card>
		</div>
		{
		    (isUpdate && status !== AssetStatus.Assigned) && (
			<Card>
			    <CardContent>
				<SeparatorWithLabel label="Additional" className="mb-4" />
				<div className="flex flex-col gap-4">

					    <InputSelect
						value={status}
						items={Object.values(AllowedStatusChange).map((value) => (
						    { label: capitalizeWords(value), value: value }
						))}
						onChange={(v) => setStatus(v as AssetStatusType)}
						Icon={Info}
						label="Status"
					    />

				</div>
			    </CardContent>
			</Card>
		    )
		}
	    </div>
	</FormWrapper>
    )
}