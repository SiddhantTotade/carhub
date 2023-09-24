"use client";

import { Hero } from "@/components";
import Image from "next/image";
import { SearchBar } from "@/components";
import { CustomFilter } from "@/components";
import { fetchCars } from "@/utils";
import { CarCard } from "@/components";
import { fuels, yearsOfProduction } from "@/constants";
import { ShowMore } from "@/components";
import { useEffect, useState } from "react";
import { CarState } from "@/types";

export default function Home() {
  const [allCars, setAllCars] = useState<CarState>([]);

  const [loading, setLoading] = useState(false);

  const [manufacturer, setManufacturer] = useState("");

  const [model, setModel] = useState("");

  const [fuel, setFuel] = useState("");

  const [year, setYear] = useState(2022);

  const [limit, setLimit] = useState(10);

  const isDataEmpty = !Array.isArray(allCars) || allCars.length < 1 || !allCars;

  const getCars = async () => {
    try {
      const result = await fetchCars({
        manufacturer: manufacturer || "",
        year: year || 2022,
        fuel: fuel || "",
        limit: limit || 10,
        model: model || "",
      });

      setAllCars(result);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCars();
  }, [fuel, year, model, manufacturer, limit]);

  return (
    <main className="overflow-hidden">
      <Hero />
      <div className="mt-12 padding-x padding-y max-width" id="discover">
        <div className="home__text-container">
          <h1 className="text-4xl font-extrabold">Car Catalogue</h1>
          <p>Explore the cars you might like</p>
        </div>
        <div className="home__filters">
          <SearchBar setManufacturer={setManufacturer} setModel={setModel} />
          <div className="home__filter-container">
            <CustomFilter setFilter={setFuel} options={fuels} />
            <CustomFilter setFilter={setYear} options={yearsOfProduction} />
          </div>
        </div>
        {allCars.length > 0 ? (
          <section>
            <div className="home__cars-wrapper">
              {allCars?.map((car, id) => (
                <CarCard key={id} car={car} />
              ))}
            </div>
            {loading && (
              <div className="flex-center w-full mt-16">
                <Image
                  src="/loader.svg"
                  alt="loader"
                  width={50}
                  height={50}
                  className="object-contain"
                />
              </div>
            )}
            <ShowMore
              pageNumber={limit / 10}
              isNext={limit > allCars.length}
              setLimit={setLimit}
            />
          </section>
        ) : (
          !loading && (
            <div className="home__error-container">
              <h2 className="text-black text-xl font-bold">
                Oops... no results
              </h2>
              <p>{allCars?.message}</p>
            </div>
          )
        )}
      </div>
    </main>
  );
}
