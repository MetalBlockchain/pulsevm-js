import { Bytes, Serializable } from "../serializable";
import { pack } from "./packer";

export const encodeActionData = (serializables: (Serializable | Serializable[])[]) => {
    return new Bytes(pack(serializables));
}