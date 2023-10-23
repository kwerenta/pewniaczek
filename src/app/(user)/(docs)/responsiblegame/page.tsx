import { DocsContainer } from "@/components/docs-container";

export default function ResponsibleGamePage() {
  return (
    <DocsContainer title="Odpowiedzialna gra">
      <p>
        Obstawianie{" "}
        <span className="font-medium underline underline-offset-4">
          pewniaczków
        </span>{" "}
        nie niesie ze sobą żadnych konsekwencji.
      </p>
      <p>
        Należy pamiętać, że większość graczy kończy przed swoją największą
        wygraną, a szanse na nią wynoszą równe 50%.
      </p>
      <p>
        Im dłuższa taśma tym większa wygrana, która cały czas ma 50% na
        powodzenie.
      </p>
    </DocsContainer>
  );
}
