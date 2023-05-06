import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import GenerateInvoiceFacadeInterface, {
  FindInvoiceFacadeInputDto,
  GenerateInvoiceFacadeInputDto,
  GenerateInvoiceFacadeOutputDto,
} from "./invoice.facade.interface";

export interface UseCaseProps {
  processUseCase: UseCaseInterface;
  findUseCase: UseCaseInterface;
}

export default class InvoiceFacade implements GenerateInvoiceFacadeInterface {
  private _findUseCase: UseCaseInterface;
  private _processUseCase: UseCaseInterface;

  constructor(useCaseProps: UseCaseProps) {
    this._processUseCase = useCaseProps.processUseCase;
    this._findUseCase = useCaseProps.findUseCase;
  }
  process(
    input: GenerateInvoiceFacadeInputDto
  ): Promise<GenerateInvoiceFacadeOutputDto> {
    return this._processUseCase.execute(input);
  }
  async find(
    input: FindInvoiceFacadeInputDto
  ): Promise<GenerateInvoiceFacadeOutputDto[]> {
    return await this._findUseCase.execute(input);
  }
}
