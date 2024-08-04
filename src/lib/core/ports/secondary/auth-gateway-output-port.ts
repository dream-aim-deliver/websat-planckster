import type { ExtractKPCredentialsDTO, GetSessionDTO } from "../../dto/auth-dto";

/**
 * Represents the output port for the authentication gateway.
 */
export default interface AuthGatewayOutputPort{
    getSession(): Promise<GetSessionDTO>;
    extractKPCredentials(): Promise<ExtractKPCredentialsDTO>;
}