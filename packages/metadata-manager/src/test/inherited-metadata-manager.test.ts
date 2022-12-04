import { InheritedMetadataManager, InheritedMetadataManagerClass } from '../lib/inherited-metadata-manager';


describe('InheritedMetadataManagerClass', () => {
  let TestMetadataManager: InheritedMetadataManager<any>;
  class TestTargetOne {}
  class TestChildOne extends TestTargetOne {}
  class TestChildTwo extends TestTargetOne {}
  class TestTargetThree {}

  const targetOneMeta = { a: 1, b: 2 };
  const childOneMeta = { b: 3, c: 4 };
  const targetThreeMeta = {};

  beforeEach(() => {
    TestMetadataManager = InheritedMetadataManagerClass<any, unknown>([
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

  describe('hasOwnMetadata', () => {
    it('should return false if no metadata has been set', () => {
      expect(TestMetadataManager.hasOwnMetadata(TestTargetThree)).toBe(false);
    });

    it('should return true if metadata has been set for the target', () => {
      expect(TestMetadataManager.hasOwnMetadata(TestTargetOne)).toBe(true);
    });

    it('should return false if metadata has been set for a target\'s ancestor, but the for the target', () => {
      expect(TestMetadataManager.hasOwnMetadata(TestChildTwo)).toBe(false);
    });
  })


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

  describe('getOwnMetadata', () => {
    it('should throw an error if no metadata is found', () => {
      expect(() => {
        TestMetadataManager.getOwnMetadata(TestTargetThree);
      }).toThrow();
    });

    it('should return the target\'s metadata', () => {
        expect(TestMetadataManager.getOwnMetadata(TestTargetOne)).toBe(targetOneMeta);
    });

    it('should return ONLY the target\'s metadata', () => {
      const expected = { ...targetOneMeta, ...childOneMeta };

      expect(TestMetadataManager.getOwnMetadata(TestChildOne)).not.toMatchObject(expected);
    });
  })


  describe('setMetadata', () => {
    it('should save the metadata for the target', () => {
        TestMetadataManager.setMetadata(TestTargetThree, targetThreeMeta);
        const meta = TestMetadataManager.getMetadata(TestTargetThree);

        expect(meta).toMatchObject(targetThreeMeta);
    });
  });


  describe('merge', () => {
    it('should merge the metadata objects', () => {
        const newMeta = { c: 4 };
        const expected = { ...targetOneMeta, ...newMeta };
    
        const result = TestMetadataManager.merge(targetOneMeta, newMeta);
    
        expect(result).toMatchObject(expected);
    });
  });

  describe('entries', () => {
    it('should return an array of Target, Metadata entries', () => {
        const entries = TestMetadataManager.entries();

        expect(Array.isArray(entries)).toBe(true);
    })
  })
})