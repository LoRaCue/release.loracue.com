export interface ReleaseModel {
    model: string;
    board_id: string;
    download_url: string;
}

export interface Release {
    version: string;
    release_type: 'stable' | 'prerelease';
    published_at: string;
    commit_sha: string;
    tag_name: string;
    manifests_url: string;
    manifests_sha256: string;
    supported_boards: string[];
    changelog_summary: string;
    models: ReleaseModel[];
}

export interface ReleaseIndex {
    schema_version: string;
    generated_at: string;
    latest_stable: string | null;
    latest_prerelease: string | null;
    releases: Release[];
    signature: string;
}

export interface FirmwareManifest {
    // Placeholder for manifest structure
    board: string;
    version: string;
    images: Record<string, string>;
    [key: string]: any;
}
