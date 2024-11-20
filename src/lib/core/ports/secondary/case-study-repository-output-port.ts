import { type GetCaseStudyMetadataDTO } from "../../dto/case-study-repository-dto";

export default interface CaseStudyRepositoryOutputPort {
  getCaseStudyMetadata(caseStudyName: string, tracerID: string, jobID: number): Promise<GetCaseStudyMetadataDTO>;
}
