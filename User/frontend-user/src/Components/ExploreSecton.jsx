import React from "react";
import { motion } from "framer-motion";

// ✅ Importing Images
import AdventureImg from "../assets/Bikebg2.jpg";
import SportsBikeImg from "../assets/Bikebg3.jpg";
import FreedomImg from "../assets/Bikebg4.jpg";

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 1 } },
};

const ExploreSection = () => {
  return (
    <div className="bg-gray-100 pt-20 px-4 pb-20  font-[Poppins] w-full min-h-screen">
      <div className="max-w-7xl mx-auto space-y-24">

        {/* Reusable Section */}
        {[{
          title: "Adventure Awaits!",
          text: "Why wait? Hop on, rev up, and explore the world on two wheels. Your perfect ride is just a click away!",
          img: AdventureImg,
          reverse: false
        },
        {
          title: "Your Ride, Your Rules!",
          text: "Choose from a range of stylish, well-maintained bikes and ride the way you want. The journey starts with you!",
          img: SportsBikeImg,
          reverse: true
        },
        {
          title: "Ride with Freedom!",
          text: "Experience the thrill of the open road with our hassle-free bike rentals. No commitments, just pure adventure!",
          img: FreedomImg,
          reverse: false
        }].map((section, index) => (
          <motion.div
            key={index}
            className={`flex flex-col md:flex-row ${section.reverse ? "md:flex-row-reverse" : ""} items-center md:items-stretch gap-10`}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionVariants}
          >
            {/* Image Section */}
            <motion.div
              className="w-full md:w-1/2 h-[400px] relative overflow-hidden rounded-2xl shadow-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={section.img}
                alt={section.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 rounded-2xl z-10"></div>
            </motion.div>

            {/* Text Section */}
            <motion.div className="w-full md:w-1/2 flex items-center justify-center text-center md:text-left z-20">
              <div>
                <motion.h1
                  className="text-4xl md:text-5xl font-bold text-orange-500 mb-3"
                  whileInView={{ scale: [0.8, 1], opacity: [0, 1] }}
                  transition={{ duration: 0.6 }}
                >
                  {section.title}
                </motion.h1>
                <p className="text-gray-800 text-base md:text-lg">{section.text}</p>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ExploreSection;
