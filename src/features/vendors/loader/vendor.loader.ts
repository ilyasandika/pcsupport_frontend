import { VendorRepository } from "@/data/repositories/vendor.repository.ts";

export const vendorLoader = async () => {
    const vendors = await VendorRepository.getAll();
    return { vendors };
};
