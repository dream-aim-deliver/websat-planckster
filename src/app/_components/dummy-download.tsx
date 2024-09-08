"use client";

import { useState } from "react";

import clientContainer from "~/lib/infrastructure/client/config/ioc/client-container";
import signalsContainer from "~/lib/infrastructure/common/signals-container";
import { type TFileDownloadViewModel } from "~/lib/core/view-models/file-download-view-model";

import type { Signal } from "~/lib/core/entity/signals";
import type BrowserFileDownloadController from "~/lib/infrastructure/client/controller/browser-file-download-controller";
import { SIGNAL_FACTORY } from "~/lib/infrastructure/common/signals-ioc-container";
import { CONTROLLERS } from "~/lib/infrastructure/client/config/ioc/client-ioc-symbols";


//export const DummyDownloadComponent = () => {
    

    //interface TSourceDataBasicInformation {
        //id: string;
        //relativePath: string;
        //localPath?: string;
    //}

    //const [selectedSourceData, setSelectedSourceData] = useState<TSourceDataBasicInformation[]>([]);


    //const [DownloadViewModel, setDownloadViewModel] =
    //useState<TFileDownloadViewModel>({
        //status: "request",
        //message: "File download not started",
    //});

    //const signalFactory = signalsContainer.get<
        //(update: (value: TFileDownloadViewModel) => void) => Signal<TFileDownloadViewModel>
    //>(SIGNAL_FACTORY.KERNEL_FILE_DOWNLOAD);

    //const S_KERNEL_FILE_DOWNLOAD_VIEW_MODEL = signalFactory(setDownloadViewModel);

    //const handleFileDownload = async () => {

        //const nonEmptySourceData = selectedSourceData.filter(sd => sd.id.length > 0);

        //if (nonEmptySourceData.length > 0) {
            //const browserFileDownloadController = clientContainer.get<BrowserFileDownloadController>(CONTROLLERS.KERNEL_FILE_DOWNLOAD_CONTROLLER)

            //try {
                //await browserFileDownloadController.execute({
                    //sourceDataBasicInformationList: nonEmptySourceData,
                    //response: S_KERNEL_FILE_DOWNLOAD_VIEW_MODEL,
                //})
                //console.log(S_KERNEL_FILE_DOWNLOAD_VIEW_MODEL.value)
                //;
            //} catch (error) {
                //console.error("File download failed:", error);
            //}

        //} else {
            //console.error("No files selected");
        //}
        
    //};

    //const handleSourceDataChange = (index: number, field: string, value: string) => {
        //setSelectedSourceData(prevState => {
            //const newState = [...prevState];
            //if (!newState[index]) {
                //newState[index] = { id: '', name: '', relativePath: '', createdAt: '' };
            //}
            //const currentItem = newState[index] ?? { id: '', name: '', relativePath: '', createdAt: '' };
            //newState[index] = { 
                //id: currentItem.id ?? '', 
                //name: currentItem.name ?? '', 
                //relativePath: currentItem.relativePath ?? '', 
                //createdAt: currentItem.createdAt ?? '', 
                //[field]: value 
            //};

            //// Filter out entries with any undefined fields
            //const filteredState = newState.filter(
                //item => item.id && item.name && item.relativePath && item.createdAt
            //);

            //return filteredState as { id: string; name: string; relativePath: string; createdAt: string }[];
        //});
    //};

    //return (
        //<div
          //id="file-downloader"
          //className="gap-md flex flex-col gap-4"
        //>

            //{[0, 1, 2].map(index => (
                //<SourceDataInput key={index} index={index} onChange={handleSourceDataChange} />
            //))}

            //{
                //selectedSourceData && (
                    //<div
                        //id="kp-download-button"
                        //className="flex flex-col gap-4 p-4"
                    //>
                        //<button
                            //className={
                                //"rounded-md border-2 border-neutral-950 bg-green-500 font-bold text-white transition hover:bg-green-700"
                            //}
                            //onClick={handleFileDownload}
                        //>
                            //Download Source Data
                        //</button>
                        //<div>
                        //{selectedSourceData.length > 0 ? (
                            //<div>Files selected: {selectedSourceData.map(sd => sd.relativePath).join(', ')}</div>
                        //) : (
                            //<div>No files selected</div>
                        //)}
                        //</div>
                        //<div>Status: {DownloadViewModel.status}</div>
                        //<div>Message: {DownloadViewModel.message}</div>
                    //</div>
                //)
            //}

        //</div>
    //);

//};

//interface SourceDataInputProps {
    //index: number;
    //onChange: (index: number, field: string, value: string) => void;
//}

//const SourceDataInput: React.FC<SourceDataInputProps> = ({ index, onChange }) => {
    //const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        //onChange(index, field, event.target.value);
    //};

    //return (
        //<div className="flex flex-col gap-2 p-2 border-8 border-purple-100">
            //<h3 className="font-bold">Source Data {index + 1}</h3>
            //<input
                //id={`sd-id-${index}`}
                //type="text"
                //className="border-4"
                //placeholder="Enter source data id..."
                //onChange={handleChange('id')}
            ///>
            //<input
                //id={`sd-name-${index}`}
                //type="text"
                //className="border-4"
                //placeholder="Enter source data name..."
                //onChange={handleChange('name')}
            ///>
            //<input
                //id={`sd-relativePath-${index}`}
                //type="text"
                //className="border-4"
                //placeholder="Enter source data relative path..."
                //onChange={handleChange('relativePath')}
            ///>
            //<input
                //id={`sd-createdAt-${index}`}
                //type="text"
                //className="border-4"
                //placeholder="Enter source data created at..."
                //onChange={handleChange('createdAt')}
            ///>
        //</div>
    //);
//};

//export default SourceDataInput;
