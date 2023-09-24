import Image from "next/image";
import { fetchCars } from "@/utils";
import { CarCard, ShowMore, CustomFilter, SearchBar, Hero } from "@/components";
import { fuels, yearsOfProduction } from "@/constants";
import { HomeProps } from "@/types";

export default async function Home({ searchParams }: HomeProps) {
  const allCars = await fetchCars({
    manufacturer: searchParams.manufacturer || "",
    year: searchParams.year || 2022,
    fuel: searchParams.fuel || "",
    limit: searchParams.limit || 10,
    model: searchParams.model || "",
  });

  const isDataEmpty = !Array.isArray(allCars) || allCars.length < 1 || !allCars;

  return (
    <main className="overflow-hidden">
      <Hero />
      <div className="mt-12 padding-x padding-y max-width" id="discover">
        <div className="home__text-container">
          <h1 className="text-4xl font-extrabold">Car Catalogue</h1>
          <p>Explore the cars you might like</p>
        </div>
        <div className="home__filters">
          <SearchBar />
          <div className="home__filter-container">
            <CustomFilter title="fuel" options={fuels} />
            <CustomFilter title="year" options={yearsOfProduction} />
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
                  src="./loader.svg"
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
