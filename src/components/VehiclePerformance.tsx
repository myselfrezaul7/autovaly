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
            <tbody>
              <tr className="border-b border-border-custom">
                <td className="py-4 px-6 text-muted font-medium w-1/3">Horsepower</td>
                <td className="py-4 px-6 font-bold">
                  {vehicle.specs.powerHp ? <><AnimatedCounter value={vehicle.specs.powerHp} /> hp</> : "N/A"}
                </td>
              </tr>
              <tr className="border-b border-border-custom">
                <td className="py-4 px-6 text-muted font-medium">Torque</td>
                <td className="py-4 px-6 font-bold">
                  {vehicle.specs.torqueNm ? <><AnimatedCounter value={vehicle.specs.torqueNm} /> Nm</> : "N/A"}
                </td>
              </tr>
              <tr className="border-b border-border-custom">
                <td className="py-4 px-6 text-muted font-medium">0-100 km/h</td>
                <td className="py-4 px-6 font-bold">
                  {vehicle.specs.acceleration060 ? <><AnimatedCounter value={vehicle.specs.acceleration060} duration={1} /> s</> : "N/A"}
                </td>
              </tr>
              <tr className="border-b border-border-custom">
                <td className="py-4 px-6 text-muted font-medium">Top Speed</td>
                <td className="py-4 px-6 font-bold">
                  {vehicle.specs.topSpeedKmh ? <><AnimatedCounter value={vehicle.specs.topSpeedKmh} /> km/h</> : "N/A"}
                </td>
              </tr>
              <tr>
                <td className="py-4 px-6 text-muted font-medium">Drivetrain</td>
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
              <tbody>
                <tr className="border-b border-border-custom">
                  <td className="py-4 px-6 text-muted font-medium w-1/3">Range (WLTP)</td>
                  <td className="py-4 px-6 font-bold">
                    {vehicle.evSpecs.rangeKm ? <><AnimatedCounter value={vehicle.evSpecs.rangeKm} /> km</> : "N/A"}
                  </td>
                </tr>
                <tr className="border-b border-border-custom">
                  <td className="py-4 px-6 text-muted font-medium">Range (EPA)</td>
                  <td className="py-4 px-6 font-bold">
                    {vehicle.evSpecs.rangeMiles ? <><AnimatedCounter value={vehicle.evSpecs.rangeMiles} /> mi</> : "N/A"}
                  </td>
                </tr>
                <tr className="border-b border-border-custom">
                  <td className="py-4 px-6 text-muted font-medium">Battery Capacity</td>
                  <td className="py-4 px-6 font-bold">
                    {vehicle.evSpecs.batteryKwh ? <><AnimatedCounter value={vehicle.evSpecs.batteryKwh} /> kWh</> : "N/A"}
                  </td>
                </tr>
                <tr className="border-b border-border-custom">
                  <td className="py-4 px-6 text-muted font-medium">Max DC Charging</td>
                  <td className="py-4 px-6 font-bold">
                    {vehicle.evSpecs.chargingSpeedKw ? <><AnimatedCounter value={vehicle.evSpecs.chargingSpeedKw} /> kW</> : "N/A"}
                  </td>
                </tr>
                <tr className="border-b border-border-custom">
                  <td className="py-4 px-6 text-muted font-medium">Fast Charge (10-80%)</td>
                  <td className="py-4 px-6 font-bold">{vehicle.evSpecs.chargingTime1080}</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-muted font-medium">Efficiency</td>
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
