import { useState, useRef, Suspense } from "react";
import { useLoaderData, Await, defer } from "react-router-dom";
import Month from "../../types/Month";
import IncomeType from "../../types/Income";
import {
  TooltipProps,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import API from "../../api/API";
import { requireAuth } from "../../utils/requireAuth";

async function loader() {
  //TODO: Currently Hardcoded Search For Host '123'
  requireAuth();
  return defer({ income: API.getHostIncome("123") });
}

function CustomTooltip({
  active,
  payload,
  label,
}: TooltipProps<number, string>) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-neutral-100 p-2 rounded-lg">
        <p className="label">{`${label} : $${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
}

function IncomeDisplay({ data }: { data: IncomeType }): JSX.Element {
  const yearsOfData = useRef(
    Array.from(Object.keys(data))
      .map((key) => {
        return parseInt(key);
      })
      .sort((a, b) => b - a)
  );
  const [barChartYear, setBarChartYear] = useState(yearsOfData.current[0]);
  return yearsOfData.current.length > 0 ? (
    <>
      <div className="flex flex-row gap-4 flex-wrap my-2">
        <h1 className="text-2xl font-bold">Income</h1>
        <select
          className="text-lg flex"
          name="incomeByYearSelect"
          id="incomeByYearSelect"
          onChange={(e) => {
            setBarChartYear(parseInt(e.target.value));
          }}
        >
          {yearsOfData.current.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div
        className="w-full"
        style={{
          height: `${30 + 30 * Object.keys(data[barChartYear]).length}px`,
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            width={300}
            height={300}
            data={Array.from(Object.keys(data[barChartYear])).map((key) => {
              const datum = {
                name: key,
                amt: data[barChartYear][key as Month],
              };
              return datum;
            })}
            margin={{
              top: 5,
              right: 0,
              left: -20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="amt" fill="#f97316" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  ) : (
    <p>{/*TODO: Generate a notice that no income data has been found */}</p>
  );
}

export default function Income() {
  const data = useLoaderData() as { income: Promise<IncomeType> };
  return (
    <section className="p-3">
      <Suspense fallback={<div>Loading Income Data...</div>}>
        <Await resolve={data.income}>
          {(income) => {
            console.log(income);
            // return <div>So happy!</div>;
            return <IncomeDisplay data={income} />;
          }}
        </Await>
      </Suspense>
    </section>
  );
}

export { loader };
