import { MdElectricBike  } from "react-icons/md";
import { BiWorld } from "react-icons/bi";
import { RiEBike2Fill } from "react-icons/ri";


export const categories = [
    {
      label: "All",
      icon: <BiWorld />,
    },
    {
      img: "assets/class1_ebike.jpg",
      label: "Class 1 E-Bike",
      icon: <MdElectricBike  />,
      description: "Pedal Assist - Enjoy the convenience of pedal-assisted cycling!",
    },
    {
      img: "assets/class2_ebike.jpg",
      label: "Class 2 E-Bike",
      icon: <MdElectricBike  />,
      description: "Throttle Only - Cruise effortlessly with throttle-powered biking!",
    },
    {
      img: "assets/class3_ebike.jpg",
      label: "Class 3 E-Bike",
      icon: <MdElectricBike  />,
      description: "Pedal Assist 28mph - Boost your speed with pedal-assist up to 28mph!",
    },
    {
      img: "assets/moped_ebike.jpg",
      label: "Moped",
      icon: <RiEBike2Fill />,
      description: "Moped - Experience the ease of electric moped transportation!",
    },
  ];
  