import Image from "next/image";

/** Pierwsze zdjęcie strony – po typograficznym hero, na całą szerokość. */
export function Plate() {
  return (
    <figure className="plate frame">
      <div className="reveal">
        <Image
          className="plate__img"
          src="/images/signature.jpg"
          alt="Wysoki podwójny cheeseburger z sałatą i cheddarem stoi sam na jasnym stole przy szarej ścianie w miękkim świetle z okna"
          width={1680}
          height={944}
          sizes="100vw"
          quality={85}
          preload
        />
      </div>
      <figcaption className="plate__cap label">
        <span>Wołowina mielona rano. Smażona po zamówieniu.</span>
        <span className="grey">Fot. sesja BUŁA, Warszawa</span>
      </figcaption>
    </figure>
  );
}
