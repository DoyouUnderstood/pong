export async function loadService(route) {
    const response = await fetch("/html/" + route); // quoi mettre dans fetch ?? et le async await va ou     
    if (!response.ok)
        throw ("Network reponse is bad.");
    return await response.text();
}
