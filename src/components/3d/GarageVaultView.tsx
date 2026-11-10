"use client";

import GarageVaultCanvas, { GarageVaultCanvasProps } from "./GarageVaultCanvas";

export type GarageVaultViewProps = GarageVaultCanvasProps;

export default function GarageVaultView(props: GarageVaultViewProps) {
  return <GarageVaultCanvas {...props} />;
}
