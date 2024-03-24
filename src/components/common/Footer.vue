<template>
  <footer class="dark:bg-dark relative z-10 mt-10 border-t bg-black pb-10 pt-10 text-white lg:pb-20">
    <div class="mx-auto max-w-[1440px] px-6">
      <div class="-mx-4 grid grid-cols-1 lg:grid-cols-3">
        <div class="w-full grid-cols-3 px-4 lg:grid-cols-1">
          <div class="mb-10 w-full">
            <h4 class="text-dark mb-4 text-lg font-semibold dark:text-white">SERVICIO AL CLIENTE</h4>
            <ul class="space-y-3">
              <li>
                <a
                  href="javascript:void(0)"
                  class="text-body-color hover:text-primary dark:text-dark-6 inline-block text-base leading-loose"
                >
                  Estado del pedido
                </a>
              </li>
              <li>
                <a
                  href="javascript:void(0)"
                  class="text-body-color hover:text-primary dark:text-dark-6 inline-block text-base leading-loose"
                >
                  Envió y entrega
                </a>
              </li>
              <li>
                <a
                  href="javascript:void(0)"
                  class="text-body-color hover:text-primary dark:text-dark-6 inline-block text-base leading-loose"
                >
                  Devoluciones
                </a>
              </li>
              <li>
                <a
                  href="javascript:void(0)"
                  class="text-body-color hover:text-primary dark:text-dark-6 inline-block text-base leading-loose"
                >
                  Cancelación del Pedido
                </a>
              </li>
              <li>
                <a
                  href="javascript:void(0)"
                  class="text-body-color hover:text-primary dark:text-dark-6 inline-block text-base leading-loose"
                >
                  Comunícate con nosotros
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div class="w-full grid-cols-3 px-4 lg:grid-cols-1">
          <div class="mb-10 w-full">
            <h4 class="text-dark mb-4 text-lg font-semibold dark:text-white">ACERCA DE eROCA</h4>
            <ul class="space-y-3">
              <li>
                <a
                  href="javascript:void(0)"
                  class="text-body-color hover:text-primary dark:text-dark-6 inline-block text-base leading-loose"
                >
                  Propósito
                </a>
              </li>
              <li>
                <a
                  href="javascript:void(0)"
                  class="text-body-color hover:text-primary dark:text-dark-6 inline-block text-base leading-loose"
                >
                  Sustentabilidad
                </a>
              </li>
              <li>
                <a
                  href="javascript:void(0)"
                  class="text-body-color hover:text-primary dark:text-dark-6 inline-block text-base leading-loose"
                >
                  Términos y Condiciones
                </a>
              </li>
              <li>
                <a
                  href="javascript:void(0)"
                  class="text-body-color hover:text-primary dark:text-dark-6 inline-block text-base leading-loose"
                >
                  Políticas de Privacidad y cookies
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div class="w-full grid-cols-3 px-4 lg:grid-cols-1">
          <div class="mb-10 w-full">
            <h4 class="text-dark mb-4 text-lg font-semibold dark:text-white">OPCIONES D E PAGO</h4>
            <section class="grid gap-2">
              <ul class="grid grid-cols-4 items-center gap-2">
                <li>
                  <img class="w-16" src="@/assets/images/paymentmethod/visa.webp" />
                </li>
                <li>
                  <img class="w-20" src="@/assets/images/paymentmethod/mastercard.webp" />
                </li>
                <li>
                  <img class="w-20" src="@/assets/images/paymentmethod/americanexpress.webp" />
                </li>
                <li>
                  <img class="w-20 invert" src="@/assets/images/paymentmethod/discover.webp" />
                </li>
              </ul>

              <ul class="grid grid-cols-4 items-center gap-2">
                <li>
                  <img class="w-20" src="@/assets/images/paymentmethod/paypal.webp" />
                </li>
                <li>
                  <img class="w-16 invert" src="@/assets/images/paymentmethod/applepay.webp" />
                </li>
                <li>
                  <img class="w-20 invert" src="@/assets/images/paymentmethod/giftcard.webp" />
                </li>
                <li>
                  <img class="w-16" src="@/assets/images/paymentmethod/zelle.webp" />
                </li>
              </ul>

              <ul class="grid grid-cols-4 items-center gap-2">
                <li>
                  <img class="w-28" src="@/assets/images/paymentmethod/banesco.webp" />
                </li>
                <li>
                  <img class="w-36" src="@/assets/images/paymentmethod/mercantil.webp" />
                </li>
                <li class="text-center">
                  <p v-text="'PagoMóvil'" class="font-bold text-base" />
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
