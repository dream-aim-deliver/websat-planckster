import { injectable } from "inversify";
import type { Signal } from "~/lib/core/entity/signals";
import { CaseStudyInputPort } from "~/lib/core/ports/primary/case-study-primary-ports";
import { TCaseStudyViewModel } from "~/lib/core/view-models/case-study-view-model";
import clientContainer from "../config/ioc/client-container";
import { USECASE_FACTORY } from "../config/ioc/client-ioc-symbols";
import { TCaseStudyRequest } from "~/lib/core/usecase-models/case-study-usecase-models";

export interface TBrowserCaseStudyControllerParameters {
  response: Signal<TCaseStudyViewModel>;
  caseStudyName: string;
  tracerID: string;
  jobID: string;
}

@injectable()
export default class BrowserCaseStudyController {
  async execute(params: TBrowserCaseStudyControllerParameters): Promise<void> {
    try {
      const { response, caseStudyName, tracerID, jobID } = params;
      const request: TCaseStudyRequest = {
        caseStudyName,
        tracerID,
        jobID,
      };
      const usecaseFactory: (response: Signal<TCaseStudyViewModel>) => CaseStudyInputPort = clientContainer.get(USECASE_FACTORY.CASE_STUDY);
      const usecase = usecaseFactory(response);
      await usecase.execute(request);
    } catch (error) {
      const err = error as Error;
      const viewModel: TCaseStudyViewModel = {
        status: "error",
        message: err.message,
        context: {
          caseStudyName: params.caseStudyName,
          tracerID: params.tracerID,
          jobID: params.jobID,
        },
      };
      params.response.update(viewModel);
    }
  }
}
