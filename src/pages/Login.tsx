import { FC } from "react";
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Определение схемы Yup
const schema = yup.object({
  email: yup.string().email('Некорректный email').required('Email обязателен'),
  password: yup.string().min(6, 'Минимум 6 символов').required('Пароль обязателен'),
}).required();

interface FormData {
  email: string;
  password: string;
}

const MyForm: FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log(data);
  };

  return (
    <div className="form_login">
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <div style={{ position: "relative" }}>
          <input className="input" {...register('email')} placeholder="Email" />
          {errors.email && <p className="validation_error">{errors.email.message}</p>}  
        </div>

        <div style={{ position: "relative" }}>
          <input className="input" {...register('password')} type="password" placeholder="Пароль" />
          {errors.password && <p className="validation_error">{errors.password.message}</p>}
        </div>
        
        <button className="button" type="submit">Отправить</button>
      </form>
    </div>
  );
};

export default MyForm;
