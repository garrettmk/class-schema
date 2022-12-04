import { Constructor } from "@garrettmk/ts-utils";
import { MetadataManagerClass, MetadataManager } from "../lib/metadata-manager";

describe('MetadataManagerClass', () => {
  let TestMetadataManager: MetadataManager<any>;
  class TestTargetOne {}
  class TestChildOne extends TestTargetOne {}
  class TestChildTwo extends TestTargetOne {}
  class TestTargetThree {}

  const targetOneMeta = { a: 1, b: 2 };
  const childOneMeta = { b: 3, c: 4 };
  const targetThreeMeta = {};

  beforeEach(() => {
    TestMetadataManager = MetadataManagerClass<any, Constructor>([
        [TestTargetOne, targetOneMeta],
        [TestChildOne, childOneMeta]
    ]);
  });


  describe('hasMetadata', () => {
    it('should return false if no metadata has been set', () => {
      expect(TestMetadataManager.hasMetadata(TestTargetThree)).toBe(false);
    });

    it('should return true if metadata has been set for the target', () => {
      expect(TestMetadataManager.hasMetadata(TestTargetOne)).toBe(true);
    });
  });


  describe('getMetadata', () => {
    it('should throw an error if no metadata is found', () => {
      expect(() => {
        TestMetadataManager.getMetadata(TestTargetThree);
      }).toThrow();
    });

    it('should return the target\'s metadata', () => {
        expect(TestMetadataManager.getMetadata(TestTargetOne)).toBe(targetOneMeta);
    });
  });


  describe('setMetadata', () => {
    it('should save the metadata for the target', () => {
        TestMetadataManager.setMetadata(TestTargetThree, targetThreeMeta);
        const meta = TestMetadataManager.getMetadata(TestTargetThree);

        expect(meta).toMatchObject(targetThreeMeta);
    });
  });

  describe('entries', () => {
    it('should return an array of Target, Metadata entries', () => {
        const entries = TestMetadataManager.entries();

        expect(Array.isArray(entries)).toBe(true);
    })
  })
})