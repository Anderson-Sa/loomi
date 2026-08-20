import { LegalDisclaimer } from "@/components/LegalDisclaimer";

export const metadata = { title: "Trocas e devoluções — Loomi" };

export default function TrocasEDevolucoesPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-bold">Trocas e devoluções</h1>
      <LegalDisclaimer />

      <div className="space-y-6 text-sm leading-relaxed text-neutral-700">
        <section>
          <h2 className="mb-2 text-base font-semibold text-neutral-900">
            1. Direito de arrependimento (7 dias)
          </h2>
          <p>
            Conforme o Art. 49 do Código de Defesa do Consumidor, como sua compra foi feita fora de
            um estabelecimento físico, você tem até <strong>7 (sete) dias corridos</strong> a
            partir do recebimento do produto para desistir da compra, sem precisar justificar o
            motivo. Nesse caso, qualquer valor pago — incluindo o frete, se houver — será
            devolvido integralmente.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-neutral-900">
            2. Produto com defeito
          </h2>
          <p>
            Se o produto chegar com defeito ou apresentar algum problema de fabricação, você tem
            até 90 dias (produto durável) para solicitar troca, reparo ou devolução do valor
            pago, conforme os Arts. 18 e 26 do Código de Defesa do Consumidor.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-neutral-900">
            3. Como solicitar
          </h2>
          <p>
            Entre em contato pelo e-mail <strong>[e-mail de atendimento]</strong> ou WhatsApp{" "}
            <strong>[número de WhatsApp]</strong> informando o número do pedido. O produto deve
            ser devolvido sem sinais de uso, com etiquetas e embalagem originais, para o endereço{" "}
            <strong>[endereço de devolução]</strong>.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-neutral-900">4. Reembolso</h2>
          <p>
            Após recebermos e conferirmos o produto devolvido, o reembolso é processado em até{" "}
            <strong>[prazo, ex.: 10 dias úteis]</strong>, no mesmo meio de pagamento usado na
            compra.
          </p>
        </section>
      </div>
    </div>
  );
}
