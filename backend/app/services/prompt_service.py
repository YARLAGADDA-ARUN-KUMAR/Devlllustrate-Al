from app.schemas.generation import IllustrationCategory, IllustrationStyle

STYLE_PROMPTS: dict[IllustrationStyle, str] = {
    "flat-vector": (
        "flat vector graphic style, clean 2D vector shapes, clear service boundaries, "
        "modern corporate tech documentation aesthetics, sharp outlines, balanced color hierarchy, SVG style"
    ),
    "isometric": (
        "30-degree isometric axonometric projection, clean technical isometric diagram, "
        "spatial dimensional depth, structured layers, modular tech blocks, clean angles"
    ),
    "blueprint": (
        "cyan engineering blueprint schematic, dark blueprint grid background, white and cyan technical lines, "
        "architectural precision, dashed annotation markers, technical drafting aesthetic"
    ),
    "minimalist": (
        "minimalist monochrome technical diagram with subtle cyan accents, razor-sharp clean linework, "
        "generous whitespace, high-contrast, uncluttered modern engineering visual"
    ),
    "3d-technical": (
        "3D technical render illustration, subtle ambient occlusion, realistic device depth, "
        "clean hardware materials, volumetric technical components, soft drop shadows"
    ),
    "line-art": (
        "fine single-weight vector line art, architectural CAD precision, technical diagram wireframe, "
        "clean geometric contours, engineering patent drawing style"
    ),
}

CATEGORY_KEYWORDS: dict[IllustrationCategory, str] = {
    "software-architecture": (
        "software architecture diagram, microservices topology, API gateway, backend services, "
        "clients, message queues, relational database and caching layers, clear data flow arrows"
    ),
    "cloud-computing": (
        "cloud infrastructure topology, virtual private cloud (VPC), multi-region subnets, "
        "load balancers, autoscaling compute worker nodes, cloud storage buckets"
    ),
    "database-systems": (
        "distributed database architecture, Raft consensus protocol, primary and replica nodes, "
        "write-ahead log (WAL), sharding hash ring, storage partition mapping"
    ),
    "cybersecurity": (
        "cybersecurity defense-in-depth architecture, Zero Trust network perimeter, "
        "web application firewall (WAF), mutual TLS authentication, encrypted KMS key vault enclave"
    ),
    "artificial-intelligence": (
        "machine learning system pipeline, transformer neural network dataflow, "
        "text embeddings, cross-attention layers, latent denoising and decoder modules"
    ),
    "networking": (
        "high-throughput network topology, service mesh proxies, gRPC streaming, "
        "ingress controller, TCP/UDP sockets, low-latency distributed tracing"
    ),
    "operating-systems": (
        "operating system internals, kernel space vs user space, system call interface, "
        "thread scheduler, memory paging unit, virtual file system"
    ),
    "general": (
        "technical documentation diagram, clear component hierarchy, organized modules, "
        "clean data flow connections, professional technical illustration"
    ),
}


class PromptService:
    @staticmethod
    def enhance_prompt(
        user_prompt: str,
        category: IllustrationCategory,
        style: IllustrationStyle,
    ) -> str:
        """
        Enhances user's natural language description into an optimal prompt for FLUX.1 Schnell
        focusing on professional technical documentation graphics.
        """
        category_context = CATEGORY_KEYWORDS.get(category, CATEGORY_KEYWORDS["general"])
        style_context = STYLE_PROMPTS.get(style, STYLE_PROMPTS["flat-vector"])

        clean_user_prompt = user_prompt.strip()

        # Construct enriched prompt
        enhanced = (
            f"A professional technical illustration for documentation: {clean_user_prompt}. "
            f"Domain: {category_context}. "
            f"Visual Style: {style_context}. "
            f"High clarity, structured composition, distinct modular components, "
            f"clean background, professional technical diagram, no watermarks, no photorealistic human faces."
        )

        return enhanced
