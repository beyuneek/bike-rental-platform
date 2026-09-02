import { categories } from "../data";
import "../styles/Categories.scss"
import { Link } from "react-router-dom";

const Categories = () => {
  return (
    <div className="categories">
      <h1>Explore Bike Categories</h1>
      <p>Ride into adventure with Type 1's friendly pedal assist, Type 2's carefree throttle joy, and Type 3's zippy pedal assist at 28mph. Plus, hop on our Mopeds for an easygoing journey—your ticket to a variety of electric bike fun!</p>

      <div className="categories_list">
        {categories?.slice(1, 5).map((category, index) => (
          <Link to="">
            <div className="category" key={index}>
              <img src={category.img} alt={category.label} />
              <div className="overlay"></div>
              <div className="category_text">
                <div className="category_text_icon">{category.icon}</div>
                <p>{category.label}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;