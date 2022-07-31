//Criando 4 etapas
//UseReducer
import { createContext, ReactNode, useContext, useReducer } from 'react';

type FormProviderProps = {
  children: ReactNode;
};

type StateProps = {
  currentStep: number;
  name: string;
  email: string;
  phone: string;
  zip: string;
  city: string;
  state: string;
  streetAddress: string;
  number: string;
  complement: string;
  neighborhood: string;
  deviceCount: number;
  type: string;
  condition: string[];
  devices: [{ type: string; condition: string }];
};

type ActionProps = {
  type: FormAction;
  payload: any;
};

type ContextProps = {
  state: StateProps;
  dispatch: (action: ActionProps) => void;
};

const initialData: StateProps = {
  currentStep: 0,
  name: '',
  email: '',
  phone: '',
  zip: '',
  city: '',
  state: '',
  streetAddress: '',
  number: '',
  complement: '',
  neighborhood: '',
  deviceCount: 1,
  type: '',
  condition: [],
  devices: [{ type: '', condition: '' }],
};

//Context
const FormContext = createContext<ContextProps | undefined>(undefined);

//Criando ações
export enum FormAction {
  setCurrentStep,
  setName,
  setEmail,
  setPhone,
  setZip,
  setCity,
  setState,
  setStreet,
  setNumber,
  setComplement,
  setNeighborhood,
  setDeviceCount,
  setDevices,
  setCondition,
}
//Recebe dados e ações
const formReducer = (state: StateProps, action: ActionProps) => {
  switch (action.type) {
    //payload são os dados que quero alterar
    case FormAction.setCurrentStep:
      return { ...state, currentStep: action.payload };
    case FormAction.setName:
      return { ...state, name: action.payload };
    case FormAction.setEmail:
      return { ...state, email: action.payload };
    case FormAction.setPhone:
      return { ...state, phone: action.payload };

    case FormAction.setZip:
      return { ...state, zip: action.payload };
    case FormAction.setCity:
      return { ...state, city: action.payload };
    case FormAction.setState:
      return { ...state, state: action.payload };
    case FormAction.setStreet:
      return { ...state, streetAddress: action.payload };
    case FormAction.setNumber:
      return { ...state, number: action.payload };
    case FormAction.setComplement:
      return { ...state, complement: action.payload };
    case FormAction.setNeighborhood:
      return { ...state, neighborhood: action.payload };

    case FormAction.setDeviceCount:
      return { ...state, deviceCount: parseInt(action.payload) };
    case FormAction.setDevices:
      return { ...state, devices: action.payload };

    case FormAction.setCondition:
      return { ...state, devices: action.payload };

    default:
      return state;
  }
};

//Provider
export const FormProvider = ({ children }: FormProviderProps) => {
  //State - dados, dispatch - função
  const [state, dispatch] = useReducer(formReducer, initialData);
  const value = { state, dispatch };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};

//Context Hook
export const useForm = () => {
  const context = useContext(FormContext);

  if (context === undefined) {
    throw new Error('userForm precisa ser usado dentro do FormProvider');
  }

  return context;
};
