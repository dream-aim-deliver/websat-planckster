import { DeleteSourceDataDTO, GetSourceDataDTO, ListSourceDataDTO } from "~/lib/core/dto/source-data-repository-dto";

/**
 * Represents the output port for the SourceDataRepository.
 * This interface defines the methods for retrieving, listing, and deleting source data.
 */
export default interface SourceDataRepositoryOutputPort {
    get(id: string, relativePath?: string): Promise<GetSourceDataDTO>;
    list(): Promise<ListSourceDataDTO>;
    delete(id: string, relativePath?: string): Promise<DeleteSourceDataDTO>;
}