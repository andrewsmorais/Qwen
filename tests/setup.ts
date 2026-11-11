// O limite por origem do checkout guarda as batidas em memória do processo:
// cada caso começa com a janela vazia, senão um arquivo herda as do anterior.
import { beforeEach } from "vitest";

import { esquecerBatidas } from "@/lib/protecao-do-checkout";

beforeEach(() => esquecerBatidas());
