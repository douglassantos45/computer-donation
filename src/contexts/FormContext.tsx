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
  cep: string;
  district: string;
  uf: string;
  city: string;
  number: string;
  street: string;
  amount: number;
  description: string;
  type: string;
  state: string;
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
  cep: '',
  district: '',
  uf: '',
  city: '',
  number: '',
  street: '',
  amount: 0,
  description: '',
  type: '',
  state: '',
};

//Context
const FormContext = createContext<ContextProps | undefined>(undefined);

//Criando ações
export enum FormAction {
  setCurrentStep,
  setName,
  setEmail,
  setPhone,
  setCep,
  setDistrict,
  setUF,
  setNumber,
  setCity,
  setStreet,
  setAmount,
  setDescription,
  setType,
  setState,
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
    case FormAction.setCep:
      return { ...state, cep: action.payload };
    case FormAction.setAmount:
      return { ...state, amount: action.payload };
    case FormAction.setDescription:
      return { ...state, description: action.payload };
    case FormAction.setType:
      return { ...state, type: action.payload };
    case FormAction.setState:
      return { ...state, state: action.payload };
    case FormAction.setCity:
      return { ...state, city: action.payload };
    case FormAction.setDistrict:
      return { ...state, district: action.payload };
    case FormAction.setUF:
      return { ...state, uf: action.payload };
    case FormAction.setNumber:
      return { ...state, number: action.payload };
    case FormAction.setStreet:
      return { ...state, street: action.payload };
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
