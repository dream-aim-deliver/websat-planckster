import { type Signal } from "../../entity/signals";
import { type TCaseStudyErrorResponse, type TCaseStudyProgressResponse, type TCaseStudyRequest, type TCaseStudySuccessResponse } from "../../usecase-models/case-study-usecase-models";
import { type TCaseStudyViewModel } from "../../view-models/case-study-view-model";

export interface CaseStudyInputPort {
  presenter: CaseStudyOutputPort;
  execute(request: TCaseStudyRequest): Promise<void>;
}

export interface CaseStudyOutputPort {
  response: Signal<TCaseStudyViewModel>;
  presentProgress(usecaseProgressResponse: TCaseStudyProgressResponse): void;
  presentSuccess(usecaseSuccessResponse: TCaseStudySuccessResponse): void;
  presentError(usecaseErrorResponse: TCaseStudyErrorResponse): void;
}
