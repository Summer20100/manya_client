import { FC } from "react";
import Header from './components/Header';
import { useCategoties } from "../store/categories";


const MainPage: FC = () => {
  const { categories, getCategories } = useCategoties();

  // getCategories();

  return (
    <div>
      <Header/>
    </div>
  );
};

export default MainPage;
