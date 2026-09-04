"use client";

import { Vehicle } from "@/lib/types";
import AnimatedCounter from "./ui/AnimatedCounter";

interface VehiclePerformanceProps {
  vehicle: Vehicle;
}

export default function VehiclePerformance({ vehicle }: VehiclePerformanceProps) {
  return (
    <>
      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <span className="w-8 h-1 bg-accent rounded-full inline-block"></span>
          Performance
        </h2>
        <div className="bg-surface rounded-xl border border-border-custom overflow-hidden">
          <table className="w-full text-sm">
            <caption className="sr-only">Performance Specifications</caption>
            <tbody>
              <tr className="border-b border-border-custom">
                <th scope="row" className="py-4 px-6 text-muted font-medium w-1/3 text-left">Horsepower</th>
                <td className="py-4 px-6 font-bold">
                  {vehicle.specs.powerHp ? <><AnimatedCounter value={vehicle.specs.powerHp} /> hp</> : "N/A"}
                </td>
              </tr>
              <tr className="border-b border-border-custom">
                <th scope="row" className="py-4 px-6 text-muted font-medium text-left">Torque</th>
                <td className="py-4 px-6 font-bold">
                  {vehicle.specs.torqueNm ? <><AnimatedCounter value={vehicle.specs.torqueNm} /> Nm</> : "N/A"}
                </td>
              </tr>
              <tr className="border-b border-border-custom">
                <th scope="row" className="py-4 px-6 text-muted font-medium text-left">0-100 km/h</th>
                <td className="py-4 px-6 font-bold">
                  {vehicle.specs.acceleration060 ? <><AnimatedCounter value={vehicle.specs.acceleration060} duration={1} /> s</> : "N/A"}
                </td>
              </tr>
              <tr className="border-b border-border-custom">
                <th scope="row" className="py-4 px-6 text-muted font-medium text-left">Top Speed</th>
                <td className="py-4 px-6 font-bold">
                  {vehicle.specs.topSpeedKmh ? <><AnimatedCounter value={vehicle.specs.topSpeedKmh} /> km/h</> : "N/A"}
                </td>
              </tr>
              <tr>
                <th scope="row" className="py-4 px-6 text-muted font-medium text-left">Drivetrain</th>
                <td className="py-4 px-6 font-bold">{vehicle.specs.drivetrain}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {vehicle.evSpecs && (
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-8 h-1 bg-accent rounded-full inline-block"></span>
            Battery & Charging
          </h2>
          <div className="bg-surface rounded-xl border border-border-custom overflow-hidden">
            <table className="w-full text-sm">
              <caption className="sr-only">Battery & Charging Specifications</caption>
              <tbody>
                <tr className="border-b border-border-custom">
                  <th scope="row" className="py-4 px-6 text-muted font-medium w-1/3 text-left">Range (WLTP)</th>
                  <td className="py-4 px-6 font-bold">
                    {vehicle.evSpecs.rangeKm ? <><AnimatedCounter value={vehicle.evSpecs.rangeKm} /> km</> : "N/A"}
                  </td>
                </tr>
                <tr className="border-b border-border-custom">
                  <th scope="row" className="py-4 px-6 text-muted font-medium text-left">Range (EPA)</th>
                  <td className="py-4 px-6 font-bold">
                    {vehicle.evSpecs.rangeMiles ? <><AnimatedCounter value={vehicle.evSpecs.rangeMiles} /> mi</> : "N/A"}
                  </td>
                </tr>
                <tr className="border-b border-border-custom">
                  <th scope="row" className="py-4 px-6 text-muted font-medium text-left">Battery Capacity</th>
                  <td className="py-4 px-6 font-bold">
                    {vehicle.evSpecs.batteryKwh ? <><AnimatedCounter value={vehicle.evSpecs.batteryKwh} /> kWh</> : "N/A"}
                  </td>
                </tr>
                <tr className="border-b border-border-custom">
                  <th scope="row" className="py-4 px-6 text-muted font-medium text-left">Max DC Charging</th>
                  <td className="py-4 px-6 font-bold">
                    {vehicle.evSpecs.chargingSpeedKw ? <><AnimatedCounter value={vehicle.evSpecs.chargingSpeedKw} /> kW</> : "N/A"}
                  </td>
                </tr>
                <tr className="border-b border-border-custom">
                  <th scope="row" className="py-4 px-6 text-muted font-medium text-left">Fast Charge (10-80%)</th>
                  <td className="py-4 px-6 font-bold">{vehicle.evSpecs.chargingTime1080}</td>
                </tr>
                <tr>
                  <th scope="row" className="py-4 px-6 text-muted font-medium text-left">Efficiency</th>
                  <td className="py-4 px-6 font-bold">{vehicle.evSpecs.efficiency}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      )}
    </>
  );
}
