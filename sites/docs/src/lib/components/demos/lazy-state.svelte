<script lang="ts">
	import { ChevronRightIcon, FileIcon, FolderIcon, TrashIcon } from "@lucide/svelte";
	import { Button, DemoContainer } from "@svecodocs/kit";
	import { LazyState } from "runed";

	type FileNode = {
		type: "file";
		name: string;
	};

	type FolderNode = {
		type: "folder";
		name: string;
		expanded: boolean;
		children: LazyState<TreeNode[]>;
	};

	type TreeNode = FileNode | FolderNode;

	const root: TreeNode[] = $state([
		{
			type: "folder",
			name: "Pictures",
			expanded: false,
			children: new LazyState(() => {
				console.log("initializing children of Pictures");
				return Array(100)
					.fill(null)
					.map((_, i) => ({
						type: "folder",
						name: `Folder ${i + 1}`,
						expanded: false,
						children: new LazyState(() => {
							console.log(`initializing children of Folder ${i + 1}`);
							return Array(100)
								.fill(null)
								.map((_, j) => ({
									type: "file",
									name: `File ${j + 1}.png`,
								}));
						}),
					}));
			}),
		},
		{
			type: "file",
			name: "README.md",
		},
	]);

	function onToggleExpansion(node: TreeNode) {
		if (node.type === "folder") {
			node.expanded = !node.expanded;
		}
	}

	function onDelete(parent: FolderNode | null, i: number) {
		if (parent === null) {
			root.splice(i, 1);
		} else {
			parent.children.current.splice(i, 1);
		}
	}
</script>

{#snippet treeitems(nodes: TreeNode[], parent: FolderNode | null, depth: number)}
	{#each nodes as node, i (node)}
		<div
			class="flex items-center gap-2 p-2"
			style="margin-inline-start: calc({depth * 6} * var(--spacing))"
		>
			<button
				aria-expanded={node.type === "folder" && node.expanded}
				data-visible={node.type === "folder"}
				class="transition-transform duration-150 aria-expanded:rotate-90 data-[visible=false]:invisible"
				onclick={() => onToggleExpansion(node)}
			>
				<ChevronRightIcon role="presentation" class="size-5" />
				<span class="sr-only">Toggle expansion</span>
			</button>

			{#if node.type === "file"}
				<FileIcon role="presentation" class="size-4" />
			{:else if node.type === "folder"}
				<FolderIcon role="presentation" class="size-4" />
			{/if}

			{node.name}

			<div class="grow"></div>

			<Button size="icon-sm" onclick={() => onDelete(parent, i)}>
				<TrashIcon role="presentation" />
				<span class="sr-only">Delete</span>
			</Button>
		</div>

		{#if node.type === "folder" && node.expanded}
			{@render treeitems(node.children.current, node, depth + 1)}
		{/if}
	{/each}
{/snippet}

<DemoContainer class="h-100 overflow-y-auto">
	{@render treeitems(root, null, 0)}
</DemoContainer>
