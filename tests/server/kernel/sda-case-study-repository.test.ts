import SDACaseStudyRepository from "~/lib/infrastructure/server/repository/sda-case-study-repository";
import fs from 'fs';

jest.mock('fs');

const mockClimateMonitoringMetadata = {
    caseStudy: 'climate-monitoring',
    keyframes: [
        {
            timestamp: '2023-01-01T00:00:00Z',
            images: [
                {
                    relativePath: 'path/to/image.jpg',
                    description: 'Test image',
                    kind: 'rgb',
                }
            ],
            data: [
                {
                    timestamp: "2023-01-01T12:00:00Z",
                    latitude: 40.7128,
                    longitude: -74.0060,
                    CarbonMonoxideLevel: "Moderate",
                    PredictedWeather: "Cloudy",
                    ActualWeather: "Rainy"
                },
            ],
            dataDescription: 'Climate data',
        },
    ],
    imageKinds: ['rgb'],
    relativePathsForAgent: ['path/to/agent/data'],
};

const mockSentinel5PMetadata = {
    caseStudy: 'sentinel-5p',
    keyframes: [
        {
            "timestamp": "1692511200",
            "images": [
                {
                    "kind": "climate-bands",
                    "relativePath": "sentinel-5p/maui-wildfire-demo/3/1692511200/sentinel/SENTINEL5P_climate-bands_4ca1e71644c048bf492460008eb13b0f.png",
                    "description": "dataset: SENTINEL5P | coords_wgs84: (-156.708984, 20.955027, -156.299744, 20.759645) | details: Carbon monoxide (CO) concentrations using a color ramp from low (blue) to high (red) and processes the image into a grid to determine dominant CO concentrations per grid cell."
                },
                {
                    "kind": "climate-mask",
                    "relativePath": "sentinel-5p/maui-wildfire-demo/3/1692511200/sentinel/SENTINEL5P_climate-mask_4ca1e71644c048bf492460008eb13b0f.png",
                    "description": "dataset: SENTINEL5P | coords_wgs84: (-156.708984, 20.955027, -156.299744, 20.759645) | details: A mask of the carbon monoxide (CO) concentrations in the image. The mask is created by thresholding the CO concentrations in the image."
                },
                {
                    "kind": "true-color",
                    "relativePath": "sentinel-5p/maui-wildfire-demo/3/1692511200/sentinel/SENTINEL2-L1C_true-color_30121dd8620b6127d1ce82379269451a.png",
                    "description": "dataset: SENTINEL2-L1C | coords_wgs84: (-156.708984, 20.955027, -156.299744, 20.759645) | details: A Sentinel-2 image highlighting areas of interest based on water, vegetation, and spectral thresholds in true color. Bands: B04, B03, B02, B08, B11, B12"
                }
            ],
            "data": [
                {
                    "errorName": "AugmentedCoordinatesError",
                    "errorMessage": "Error while processing augmented coordinates: timed out"
                }
            ],
            "dataDescription": "This data is a collection of Carbon Monoxide levels for the given timestamp for the given coordinates"
        },
        {
            "timestamp": "1693008000",
            "images": [
                {
                    "kind": "true-color",
                    "relativePath": "sentinel-5p/maui-wildfire-demo/3/1693008000/sentinel/SENTINEL2-L1C_true-color_30121dd8620b6127d1ce82379269451a.png",
                    "description": "dataset: SENTINEL2-L1C | coords_wgs84: (-156.708984, 20.955027, -156.299744, 20.759645) | details: A Sentinel-2 image highlighting areas of interest based on water, vegetation, and spectral thresholds in true color. Bands: B04, B03, B02, B08, B11, B12"
                },
                {
                    "kind": "climate-mask",
                    "relativePath": "sentinel-5p/maui-wildfire-demo/3/1693008000/sentinel/SENTINEL5P_climate-mask_4ca1e71644c048bf492460008eb13b0f.png",
                    "description": "dataset: SENTINEL5P | coords_wgs84: (-156.708984, 20.955027, -156.299744, 20.759645) | details: A mask of the carbon monoxide (CO) concentrations in the image. The mask is created by thresholding the CO concentrations in the image."
                },
                {
                    "kind": "climate-bands",
                    "relativePath": "sentinel-5p/maui-wildfire-demo/3/1693008000/sentinel/SENTINEL5P_climate-bands_4ca1e71644c048bf492460008eb13b0f.png",
                    "description": "dataset: SENTINEL5P | coords_wgs84: (-156.708984, 20.955027, -156.299744, 20.759645) | details: Carbon monoxide (CO) concentrations using a color ramp from low (blue) to high (red) and processes the image into a grid to determine dominant CO concentrations per grid cell."
                }
            ],
            "data": [
                {
                    "errorName": "AugmentedCoordinatesError",
                    "errorMessage": "Error while processing augmented coordinates: timed out"
                }
            ],
            "dataDescription": "This data is a collection of Carbon Monoxide levels for the given timestamp for the given coordinates"
        },
    ],
    imageKinds: [
        "climate-mask",
        "climate-bands",
        "true-color"
    ],
    relativePathsForAgent: ['path/to/agent/data'],
}

const mockSwissGridMetadata = {
    caseStudy: "swissgrid",
    imageKinds: ["map", "chart", "heatmap", "lineGraph"],
    relativePathsForAgent: [
        "data/swissgrid/images/",
        "data/swissgrid/csv/",
        "data/swissgrid/processed/"
    ],
    keyframes: [
        {
            timestamp: "2023-01-15T08:00:00Z",
            images: [
                {
                    kind: "map",
                    relativePath: "data/swissgrid/images/grid_map_20230115.png",
                    description: "Swiss electricity grid map showing power flow distribution",
                },
                {
                    errorName: "Image retrieval failed",
                    errorMessage: "Cannot access chart image: load_chart_20230115.png - file not found"
                }
            ],
            data: [
                {
                    "timestamp": "1693008000",
                    model: "Generator Station A",
                    prediction: "ON",
                    confidence: 0.95
                },
                {
                    "timestamp": "1693008000",
                    model: "Transmission Line B-C",
                    prediction: "ON",
                    confidence: 0.87
                },
                {
                    "timestamp": "1693008000",
                    model: "Substation D",
                    prediction: "OFF",
                    confidence: 0.92
                },
            ],
            dataDescription: "Grid load and capacity measurements across Swiss regions during morning peak hours."
        },
        {
            timestamp: "2023-01-15T12:00:00Z",
            images: [
                {
                    kind: "map",
                    relativePath: "data/swissgrid/images/grid_map_20230115.png",
                    description: "Swiss electricity grid map showing power flow distribution",
                },
                {
                    kind: "map",
                    relativePath: "data/swissgrid/images/grid_map_20230115.png",
                    description: "Swiss electricity grid map showing power flow distribution",
                },
                {
                    errorName: "Authorization error",
                    errorMessage: "Access denied to secure image resource: system_status_20230115.png"
                }
            ],
            data: [
                {
                    "timestamp": "1693008000",
                    model: "Generator Station A",
                    prediction: "ON",
                    confidence: 0.95
                },
                {
                    "timestamp": "1693008000",
                    model: "Transmission Line B-C",
                    prediction: "ON",
                    confidence: 0.87
                },
                {
                    "timestamp": "1693008000",
                    model: "Substation D",
                    prediction: "OFF",
                    confidence: 0.92
                },
            ],
            dataDescription: "Grid load and capacity measurements during midday peak consumption."
        }
    ]
};


describe('SDACaseStudyRepository', () => {
    let repository: SDACaseStudyRepository;
    let mockLoggerFactory;
    let mockLogger: any;
    let mockKernelSourceDataGateway: any;

    beforeEach(() => {
        // Mock logger
        mockLogger = {
            info: jest.fn(),
            error: jest.fn(),
        };
        mockLoggerFactory = jest.fn().mockReturnValue(mockLogger);

        // Mock kernel source data gateway
        mockKernelSourceDataGateway = {
            download: jest.fn(),
            getClientDataForDownload: jest.fn(),
        };

        // Create repository instance with mocked dependencies
        repository = new SDACaseStudyRepository(
            mockLoggerFactory,
            mockKernelSourceDataGateway
        );
    });

    describe('getCaseStudyMetadata', () => {
        it('should return success with valid metadata', async () => {
            // Mock download response
            mockKernelSourceDataGateway.download.mockResolvedValue({
                success: true,
                data: {
                    relativePath: '/tmp/local-path/metadata.json',
                },
            });

            // Mock file system
            // @ts-ignore (mocking fs.readFileSync)
            fs.readFileSync.mockReturnValue(Buffer.from(JSON.stringify(mockClimateMonitoringMetadata)));

            // Execute method
            const result = await repository.getCaseStudyMetadata('climate-monitoring', 'tracer-123', 456);

            // Assertions
            expect(result.success).toBe(true);
            expect(result.data.caseStudy).toBe('climate-monitoring');
            expect(result.data.keyframes).toHaveLength(1);
            expect(result.data.keyframes[0].images).toHaveLength(1);

            // Verify that expiration time was added and is roughly an hour in the future
            expect(result.data.expirationTime).toBeDefined();
            const now = Date.now();
            const oneHour = 60 * 60 * 1000;
            expect(result.data.expirationTime).toBeGreaterThan(now);
            expect(result.data.expirationTime).toBeLessThan(now + oneHour + 1000); // Add buffer for test execution time

            // Verify logger was called
            expect(mockLogger.info).toHaveBeenCalledWith(
                { caseStudyName: 'climate-monitoring', tracerID: 'tracer-123', jobID: 456 },
                'Getting case study metadata.'
            );
        });

        it('should handle download failure', async () => {
            // Mock download failure
            mockKernelSourceDataGateway.download.mockResolvedValue({
                success: false,
                data: {
                    message: 'Download failed',
                },
            });

            // Execute method
            const result = await repository.getCaseStudyMetadata('climate-monitoring', 'tracer-123', 456);

            // Assertions
            expect(result.success).toBe(false);
            expect(result.data.message).toBe('Failed to download metadata file.');
            expect(result.data.operation).toBe('sdaCaseStudy#getCaseStudyMetadata');
        });

        it('should handle invalid metadata format', async () => {
            // Mock download success
            mockKernelSourceDataGateway.download.mockResolvedValue({
                success: true,
                data: {
                    relativePath: '/tmp/local-path/metadata.json',
                },
            });

            // Mock invalid metadata JSON
            // @ts-ignore (mocking fs.readFileSync)
            fs.readFileSync.mockReturnValue(Buffer.from('{"invalidKey": "value"}'));

            // Execute method
            const result = await repository.getCaseStudyMetadata('climate-monitoring', 'tracer-123', 456);

            // Assertions
            expect(result.success).toBe(false);
            expect(result.data.message).toBe('Failed to parse metadata.');
            expect(mockLogger.error).toHaveBeenCalled();
        });

        it('should handle case study name mismatch', async () => {
            // Mock download success
            mockKernelSourceDataGateway.download.mockResolvedValue({
                success: true,
                data: {
                    relativePath: '/tmp/local-path/metadata.json',
                },
            });

            // @ts-ignore (mocking fs.readFileSync)
            fs.readFileSync.mockReturnValue(Buffer.from(JSON.stringify(mockClimateMonitoringMetadata)));

            // Execute method
            const result = await repository.getCaseStudyMetadata('sentinel-5p', 'tracer-123', 456);

            // Assertions
            expect(result.success).toBe(false);
            expect(result.data.message).toBe('Case study name mismatch.');
        });

        it('should handle unsupported case study', async () => {
            // Mock download success
            mockKernelSourceDataGateway.download.mockResolvedValue({
                success: true,
                data: {
                    relativePath: '/tmp/local-path/metadata.json',
                },
            });

            const unsupportedCaseStudy = 'unsupported-case-study';

            // Mock metadata with unsupported case study
            const mockMetadata = {
                caseStudy: unsupportedCaseStudy,
                keyframes: [],
                imageKinds: [],
                relativePathsForAgent: [],
            };

            // @ts-ignore (mocking fs.readFileSync)
            fs.readFileSync.mockReturnValue(Buffer.from(JSON.stringify(mockMetadata)));

            // Execute method
            const result = await repository.getCaseStudyMetadata(unsupportedCaseStudy, 'tracer-123', 456);

            // Assertions
            expect(result.success).toBe(false);
            expect(result.data.message).toBe('Failed to parse metadata.');
        });

        it('should handle unexpected exceptions', async () => {
            // Mock download to throw exception
            mockKernelSourceDataGateway.download.mockRejectedValue(new Error('Unexpected error'));

            // Execute method
            const result = await repository.getCaseStudyMetadata('climate-monitoring', 'tracer-123', 456);

            // Assertions
            expect(result.success).toBe(false);
            expect(result.data.message).toBe('Error while attempting to get case study metadata.');
            expect(mockLogger.error).toHaveBeenCalled();
        });

        it('should handle errors in keyframe data', async () => {
            mockKernelSourceDataGateway.download.mockResolvedValue({
                success: true,
                data: {
                    relativePath: '/tmp/local-path/metadata.json',
                },
            });

            // Mock file system
            // @ts-ignore (mocking fs.readFileSync)
            fs.readFileSync.mockReturnValue(Buffer.from(JSON.stringify(mockSentinel5PMetadata)));

            // Execute method
            const result = await repository.getCaseStudyMetadata('sentinel-5p', 'tracer-123', 456);

            expect(result.success).toBe(true);
            expect(result.data.keyframes[0].data[0]).toEqual({
                errorName: 'AugmentedCoordinatesError',
                errorMessage: 'Error while processing augmented coordinates: timed out',
            });
        });

        it('should handle errors in images', async () => {
            mockKernelSourceDataGateway.download.mockResolvedValue({
                success: true,
                data: {
                    relativePath: '/tmp/local-path/metadata.json',
                },
            });

            // Mock file system
            // @ts-ignore (mocking fs.readFileSync)
            fs.readFileSync.mockReturnValue(Buffer.from(JSON.stringify(mockSwissGridMetadata)));

            // Execute method
            const result = await repository.getCaseStudyMetadata('swissgrid', 'tracer-123', 456);

            expect(result.success).toBe(true);
            expect(result.data.keyframes[0].images[1]).toEqual({
                errorName: "Image retrieval failed",
                errorMessage: "Cannot access chart image: load_chart_20230115.png - file not found"
            });
        });
    });
});