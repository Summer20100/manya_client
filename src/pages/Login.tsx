import { FC } from "react";
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { IBaseLogin } from '../models/ILogin';
import * as yup from 'yup';
import { useLogin } from "../store/login";

const schema = yup.object({
  name: yup
    .string()
    .min(3, 'Минимум 3 символа')
    .max(16, 'Максимум 16 символов')
    .required('Имя обязательно'),
  password: yup.string().min(5, 'Минимум 5 символов').required('Пароль обязателен'),
}).required();

const Login: FC = () => {
  const { login } = useLogin();
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<IBaseLogin>({
    mode: 'all',
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<IBaseLogin> = (data) => {
    login(data);
  };

  return (
    <div className="login">
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <div style={{ position: "relative" }}>
          <input 
            className="input" 
            {...register('name')} 
            placeholder="Имя" 
          />
          {errors.name && <p className="validation_error">{errors.name.message}</p>}  
        </div>

        <div style={{ position: "relative" }}>
          <input 
            className="input" 
            {...register('password')} 
            type="password" 
            placeholder="Пароль" 
          />
          {errors.password && <p className="validation_error">{errors.password.message}</p>}
        </div>
        
        <button className="button" type="submit">Отправить</button>
      </form>
    </div>
  );
};

export default Login;
