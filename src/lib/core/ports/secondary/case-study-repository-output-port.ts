import { type DownloadMapFilesDTO, type GetCaseStudyMetadataDTO } from "../../dto/case-study-repository-dto";
import { type RemoteFile } from "../../entity/file";

export default interface CaseStudyRepositoryOutputPort {
  getCaseStudyMetadata(caseStudyName: string, tracerID: string, jobID: string): Promise<GetCaseStudyMetadataDTO>;
  downloadMapFiles(mapRemoteFiles: RemoteFile[]): Promise<DownloadMapFilesDTO>;
}
