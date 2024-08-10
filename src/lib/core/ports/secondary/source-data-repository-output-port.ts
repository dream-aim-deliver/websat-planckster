import type { DeleteSourceDataDTO, GetSourceDataDTO, ListSourceDataDTO } from "~/lib/core/dto/source-data-repository-dto";
import type { File } from "~/lib/core/entity/file";
/**
 * Represents the output port for the SourceDataRepository.
 * This interface defines the methods for retrieving, listing, and deleting source data.
 */
export default interface SourceDataRepositoryOutputPort {
    get(file: File): Promise<GetSourceDataDTO>;
    list(): Promise<ListSourceDataDTO>;
    delete(file: File): Promise<DeleteSourceDataDTO>;
}