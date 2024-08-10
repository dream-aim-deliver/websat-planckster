import type { DeleteSourceDataDTO, GetSourceDataDTO, ListSourceDataDTO } from "~/lib/core/dto/source-data-repository-dto";

/**
 * Represents the output port for the SourceDataRepository.
 * This interface defines the methods for retrieving, listing, and deleting source data.
 */
export default interface SourceDataRepositoryOutputPort<TSourceDataID> {
    get(id: TSourceDataID): Promise<GetSourceDataDTO>;
    list(): Promise<ListSourceDataDTO>;
    delete(id: string): Promise<DeleteSourceDataDTO>;
}