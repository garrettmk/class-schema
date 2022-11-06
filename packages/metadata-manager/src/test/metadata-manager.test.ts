import { MetadataManagerClass } from "src/lib/metadata-manager";
import { MetadataDict, MetadataManager } from "src/lib/types";

describe('MetadataManagerClass', () => {
  let TestMetadataManager: MetadataManager;
  class TestTargetOne {}
  class TestChildOne extends TestTargetOne {}
  class TestChildTwo extends TestTargetOne {}
  class TestTargetThree {}

  const targetOneMeta: MetadataDict = { a: 1, b: 2 };
  const childOneMeta: MetadataDict = { b: 3 };
  const targetThreeMeta: MetadataDict = {};

  beforeEach(() => {
    TestMetadataManager = MetadataManagerClass([
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

    it('should return true if metadata has been set for a target\'s ancestor', () => {
      expect(TestMetadataManager.hasMetadata(TestChildTwo)).toBe(true);
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

    it('should merge the inherited metadata', () => {
        const expected = { ...targetOneMeta, ...childOneMeta };

        expect(TestMetadataManager.getMetadata(TestChildOne)).toMatchObject(expected);
    });
  });


  describe('setMetadata', () => {
    it('should save the metadata for the target', () => {
        TestMetadataManager.setMetadata(TestTargetThree, targetThreeMeta);
        const meta = TestMetadataManager.getMetadata(TestTargetThree);

        expect(meta).toMatchObject(targetThreeMeta);
    });
  });


  describe('mergeMetadata', () => {
    it('should save the merged metadata', () => {
        const newMeta = { c: 4 };
        const expected = { ...targetOneMeta, ...newMeta };
    
        TestMetadataManager.mergeMetadata(TestTargetOne, newMeta);
    
        expect(TestMetadataManager.getMetadata(TestTargetOne)).toMatchObject(expected);
    });
  });

  describe('entries', () => {
    it('should return an array of Target, Metadata entries', () => {
        const entries = TestMetadataManager.entries();

        expect(Array.isArray(entries)).toBe(true);
    })
  })
})