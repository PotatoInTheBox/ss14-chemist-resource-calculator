import os
import yaml
import json
import requests
import datetime

# Configuration
REPO_OWNER = "space-wizards"
REPO_NAME = "space-station-14"
REAGENTS_PATH = "Resources/Prototypes/Reagents"
REACTIONS_PATH = "Resources/Prototypes/Recipes/Reactions"

OUTPUT_REAGENTS = "public/reagents.json"
OUTPUT_REACTIONS = "public/reactions.json"

# --- YAML Parser Setup ---
def ignore_unknown_tag(loader, tag_suffix, node):
    if isinstance(node, yaml.ScalarNode): return loader.construct_scalar(node)
    if isinstance(node, yaml.SequenceNode): return loader.construct_sequence(node)
    if isinstance(node, yaml.MappingNode): return loader.construct_mapping(node)
    return None

yaml.SafeLoader.add_multi_constructor('!type:', ignore_unknown_tag)

def get_github_files(path):
    """Recursively fetches all .yml file contents from a GitHub directory."""
    api_url = f"https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}/contents/{path}"
    response = requests.get(api_url)
    response.raise_for_status()
    
    files_data = []
    for item in response.json():
        if item["type"] == "dir":
            files_data.extend(get_github_files(item["path"]))
        elif item["name"].endswith(".yml"):
            raw_url = item["download_url"]
            file_content = requests.get(raw_url).text
            files_data.append(file_content)
    return files_data

# --- Processing ---
reagents = [{
    "id": "UnknownReagent",
    "color": "#FFFFFF"
}]

reactions = [{
    "id": "UnknownReaction",
    "reactants": {},
    "products": {}
}]

print("Fetching Reagents...")
reagent_files = get_github_files(REAGENTS_PATH)
for content in reagent_files:
    docs = yaml.safe_load_all(content)
    for doc in docs:
        if isinstance(doc, list):
            for entry in doc:
                if entry.get("type") == "reagent":
                    rid = entry.get("id")
                    if rid:
                        reagents.append({"id": rid, "color": entry.get("color", "gray")})

print("Fetching Reactions...")
reaction_files = get_github_files(REACTIONS_PATH)
for content in reaction_files:
    docs = yaml.safe_load_all(content)
    for doc in docs:
        if isinstance(doc, list):
            for entry in doc:
                if entry.get("type") == "reaction":
                    reactants = {r: (d.get("amount") if isinstance(d, dict) else d) 
                                 for r, d in (entry.get("reactants") or {}).items()}
                    
                    products = {p: d for p, d in (entry.get("products") or {}).items()}
                    
                    # Handle Catalysts
                    for r, d in (entry.get("reactants") or {}).items():
                        if isinstance(d, dict) and d.get("catalyst"):
                            products[r] = d.get("amount")

                    reactions.append({
                        "id": entry.get("id"),
                        "reactants": reactants,
                        "products": products,
                        **({"minTemp": entry.get("minTemp")} if "minTemp" in entry else {})
                    })

# --- Pruning & Export ---
used_names = {name for r in reactions for name in list(r["reactants"]) + list(r["products"])}
pruned_reagents = [r for r in reagents if r["id"] in used_names or r["id"] == "UnknownReagent"]

os.makedirs("public", exist_ok=True)
with open(OUTPUT_REAGENTS, "w") as f: json.dump(pruned_reagents, f, indent=2)
with open(OUTPUT_REACTIONS, "w") as f: json.dump(reactions, f, indent=2)

OUTPUT_RETRIEVE = "public/retrieve.json"
retrieval_data = {
    "lastRetrieved": datetime.datetime.now().isoformat()
}
with open(OUTPUT_RETRIEVE, "w") as f: 
    json.dump(retrieval_data, f, indent=2)

print(f"Done. Saved {len(pruned_reagents)} reagents and {len(reactions)} reactions.")